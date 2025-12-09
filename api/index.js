// Vercel serverless function handler - Sadece API istekleri için
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../backend/config/database');

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
let dbConnected = false;
if (!dbConnected) {
  try {
    connectDB();
    dbConnected = true;
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
  }
}

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

// Vercel serverless function için export
// Sadece /api/* istekleri buraya gelir
module.exports = app;
