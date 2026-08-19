// routes/transactionRoutes.js - All transaction operations
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const authenticate = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for a transaction
const transactionSchema = Joi.object({
  customerName: Joi.string().min(2).required(),
  phone: Joi.string().min(5).required(),
  type: Joi.string().valid('WITHDRAWAL', 'TRANSFER', 'DEPOSIT', 'AIRTIME', 'DATA', 'BILL_PAYMENT').required(),
  amount: Joi.number().positive().required(),
  charge: Joi.number().min(0).required(),
  description: Joi.string().allow('', null)
});

// ---------- DASHBOARD STATS (THIS IS THE FIX) ----------
router.get('/dashboard/stats', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    // Calculate totals
    let totalRevenue = 0;
    let totalWithdrawals = 0;
    let totalTransfers = 0;
    let totalDeposits = 0;
    let totalAirtime = 0;
    let totalData = 0;
    let totalBill = 0;

    transactions.forEach(t => {
      totalRevenue += t.amount;
      switch (t.type) {
        case 'WITHDRAWAL': totalWithdrawals += t.amount; break;
        case 'TRANSFER': totalTransfers += t.amount; break;
        case 'DEPOSIT': totalDeposits += t.amount; break;
        case 'AIRTIME': totalAirtime += t.amount; break;
        case 'DATA': totalData += t.amount; break;
        case 'BILL_PAYMENT': totalBill += t.amount; break;
      }
    });

    // Chart data for last 7 days
    const today = new Date();
    const daysMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      daysMap[key] = 0;
    }
    transactions.forEach(t => {
      const key = t.date.toISOString().split('T')[0];
      if (daysMap[key] !== undefined) daysMap[key] += t.amount;
    });

    const chartData = Object.keys(daysMap).map(date => ({
      date,
      amount: daysMap[date]
    }));

    res.json({
      totalTransactions: transactions.length,
      totalRevenue,
      totalWithdrawals,
      totalTransfers,
      totalDeposits,
      totalAirtime,
      totalData,
      totalBill,
      chartData,
      recentTransactions: transactions.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- GET ALL (with search, filter, sort) ----------
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { search, type, sort } = req.query;

    let whereClause = { userId };
    if (type && type !== 'ALL') {
      whereClause.type = type;
    }
    if (search) {
      whereClause.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy = { date: 'desc' };
    if (sort === 'oldest') orderBy = { date: 'asc' };
    else if (sort === 'highest') orderBy = { amount: 'desc' };
    else if (sort === 'lowest') orderBy = { amount: 'asc' };

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- CREATE ----------
router.post('/', authenticate, async (req, res) => {
  try {
    const { error } = transactionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { customerName, phone, type, amount, charge, description } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        customerName,
        phone,
        type,
        amount,
        charge,
        description,
        userId: req.userId
      }
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- UPDATE ----------
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { error } = transactionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const id = parseInt(req.params.id);
    const { customerName, phone, type, amount, charge, description } = req.body;

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.userId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { customerName, phone, type, amount, charge, description }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- DELETE ----------
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.userId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;