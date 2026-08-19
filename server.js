// server.js - Main entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://pay-record-taupe.vercel.app',
    'https://pay-record-hcfko0115-perfect-s-projects1.vercel.app'
  ],
  credentials: true // only needed if auth uses cookies
}));
app.use(express.json());

// Public routes (Login / Register)
app.use('/api/auth', authRoutes);

// Protected routes (All transaction endpoints)
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pay Record API is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});