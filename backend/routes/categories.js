const express = require('express');
const Category = require('../models/Category');
const { authenticate, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Tüm kategorileri getir
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kategori oluştur (Admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Kategori adı gereklidir.' });
    }

    const category = new Category({ name: name.trim() });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bu kategori zaten mevcut.' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Kategori güncelle (Admin)
router.patch('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Kategori adı gereklidir.' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    res.json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bu kategori adı zaten kullanılıyor.' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Kategori sil (Admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    res.json({ message: 'Kategori silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

