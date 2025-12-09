const express = require('express');
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Tüm kullanıcıları getir (Admin)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı oluştur (Admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validasyon
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'İsim, email ve şifre gereklidir.' });
    }

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kullanılıyor.' });
    }

    // Kullanıcı oluştur
    const user = new User({
      name,
      email,
      password,
      role: role || 'user' // Varsayılan olarak 'user', admin belirtilirse 'admin'
    });
    await user.save();

    // Şifreyi response'dan çıkar
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı güncelle (Admin)
router.patch('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (role) updateData.role = role;
    if (password) updateData.password = password;

    // Email değişiyorsa kontrol et
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Bu email zaten kullanılıyor.' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı sil (Admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    // Kendi hesabını silmeyi engelle
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Kendi hesabınızı silemezsiniz.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.json({ message: 'Kullanıcı silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

