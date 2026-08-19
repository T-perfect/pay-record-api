# 🔧 PayRecord API

> **RESTful API** for the PayRecord POS transaction tracking system. Built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Live API
[🔗 API Base URL](https://pay-record-api.onrender.com)

**Health Check:**  
`https://pay-record-api.onrender.com/api/health`

---

## 📋 Overview

This is the backend service for the PayRecord application. It handles user authentication, transaction management, and provides real-time dashboard statistics.

### Key Features
- 🔐 **JWT Authentication** – Secure login/register with bcrypt password hashing.
- 📊 **Dashboard Stats** – Aggregated revenue, transaction counts, and 7-day chart data.
- ✏️ **Full CRUD** – Create, Read, Update, and Delete transactions.
- 🔍 **Search & Filter** – Query transactions by customer name, phone, type, and sort by amount.
- 🛡️ **Input Validation** – Joi schemas to ensure data integrity.
- 🗄️ **PostgreSQL** – Cloud database via Neon with Prisma ORM.

---

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon.tech)
- **Authentication:** JWT + bcrypt
- **Validation:** Joi
- **Deployment:** Render

---

## 📂 Project Structure (Made Simple)

Here is a quick tour of the backend folders, explained in plain English:

- **📁 `prisma/` (The Blueprint)**  
  This folder contains the design of your database. The `schema.prisma` file is like a blueprint that tells the database: "We need a table for `Users` and a table for `Transactions`." It also defines how they are connected (for example, one user can have many transactions).

- **📁 `routes/` (The Reception Desk)**  
  Think of this as the front desk of a hotel. When a request comes in (like "Login" or "Add a sale"), this folder decides where to send it. 
  - `authRoutes.js` handles **Login** and **Registration** requests. 
  - `transactionRoutes.js` handles everything about **sales** — adding, viewing, editing, deleting, and even calculating total revenue for the dashboard.

- **📁 `middleware/` (The Security Guard)**  
  This folder holds the bouncer of your app. The `auth.js` file checks if a user is actually logged in before letting them view or edit any transactions. If they don't have a valid ID card (JWT token), it kicks them out with a "401 Unauthorized" error.

- **📄 `server.js` (The Main Engine)**  
  This is the heart of the backend. It turns on the server, connects all the routes, and starts listening for requests (like turning the key in a car to start the engine).

- **📄 `package.json` (The Shopping List)**  
  This is a simple list of all the tools and packages the backend needs to run, such as Express, Prisma, and JWT. When you run `npm install`, your computer reads this list and downloads everything required.

- **📄 `.env` (The Secret Vault)**  
  This file holds sensitive information like the database password and the JWT secret key. It is **never** shared on GitHub, keeping your app secure from hackers.

---

## 🧩 Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL database (Neon.tech recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/T-perfect/pay-record-api.git
cd pay-record-api