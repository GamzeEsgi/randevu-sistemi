// Vercel serverless function handler
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../backend/config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB bağlantısı
let dbConnected = false;
if (!dbConnected) {
  try {
    connectDB();
    dbConnected = true;
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/auth', require('../backend/routes/auth'));
app.use('/users', require('../backend/routes/users'));
app.use('/categories', require('../backend/routes/categories'));
app.use('/companies', require('../backend/routes/companies'));
app.use('/appointments', require('../backend/routes/appointments'));

// Vercel serverless function export
module.exports = app;
