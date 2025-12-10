// Vercel serverless function - Express app wrapper
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

// Vercel'de /api prefix'ini kaldır (rewrite sonrası path hala /api/auth/login şeklinde geliyor)
app.use((req, res, next) => {
  // Vercel'de /api/auth/login -> /auth/login'e çevir
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace('/api', '');
    req.path = req.path.replace('/api', '');
  }
  next();
});

// MongoDB bağlantısı middleware - Her request'te bağlantıyı kontrol et
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    // Hata detaylarını logla (production'da da)
    console.error('Hata detayı:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Veritabanı bağlantı hatası',
      error: process.env.NODE_ENV === 'production' ? 'Database connection failed' : error.message
    });
  }
});

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Endpoint bulunamadı',
    path: req.path 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Sunucu hatası',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Vercel serverless function export
// Vercel otomatik olarak Express app'i handle eder
module.exports = app;
