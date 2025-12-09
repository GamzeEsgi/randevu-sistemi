// Vercel serverless function handler
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
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

// MongoDB bağlantısı (sadece ilk çağrıda)
let dbConnected = false;
if (!dbConnected) {
  connectDB();
  dbConnected = true;
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

// Frontend static dosyalarını serve et
app.use(express.static(path.join(__dirname, '../frontend')));

// SPA için tüm route'ları index.html'e yönlendir
app.get('*', (req, res) => {
  // API route'larını atla
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint bulunamadı.' });
  }
  
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Vercel serverless function için export
module.exports = app;
