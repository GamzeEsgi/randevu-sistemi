// Vercel serverless function handler
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Ortam değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB bağlantısı
const connectDB = require('../backend/config/database');
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/users', require('../backend/routes/users'));
app.use('/api/categories', require('../backend/routes/categories'));
app.use('/api/companies', require('../backend/routes/companies'));
app.use('/api/appointments', require('../backend/routes/appointments'));

// Vercel serverless function için handler
module.exports = app;
