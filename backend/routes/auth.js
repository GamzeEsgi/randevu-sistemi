const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// JWT token oluşturma
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Kayıt
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasyon
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar gereklidir.' });
    }

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kullanılıyor.' });
    }

    // Kullanıcı oluştur
    const user = new User({ name, email, password });
    await user.save();

    // Token oluştur
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Kayıt başarılı',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Giriş
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasyon
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre gereklidir.' });
    }

    // Kullanıcı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email veya şifre hatalı.' });
    }

    // Şifre kontrolü
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email veya şifre hatalı.' });
    }

    // Token oluştur
    const token = generateToken(user._id);

    res.json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı bilgilerini getir
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;

