const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token doğrulama middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Token bulunamadı. Lütfen giriş yapın.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token.' });
  }
};

// Admin kontrolü middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bu işlem için admin yetkisi gereklidir.' });
  }
  next();
};

module.exports = { authenticate, isAdmin };

