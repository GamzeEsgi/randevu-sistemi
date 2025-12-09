const express = require('express');
const Company = require('../models/Company');
const { authenticate, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Şirketleri getir (kategoriye göre filtreleme)
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    const query = categoryId ? { categoryId } : {};

    const companies = await Company.find(query)
      .populate('categoryId', 'name')
      .sort({ name: 1 });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Şirket oluştur (Admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { categoryId, name, address, workingHours } = req.body;

    // Validasyon
    if (!categoryId || !name || !address || !workingHours) {
      return res.status(400).json({ message: 'Tüm alanlar gereklidir.' });
    }

    if (!workingHours.start || !workingHours.end) {
      return res.status(400).json({ message: 'Çalışma saatleri gereklidir.' });
    }

    const company = new Company({
      categoryId,
      name: name.trim(),
      address: address.trim(),
      workingHours
    });

    await company.save();
    await company.populate('categoryId', 'name');

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Şirket güncelle (Admin)
router.patch('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, address, workingHours } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (address) updateData.address = address.trim();
    if (workingHours) updateData.workingHours = workingHours;

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name');

    if (!company) {
      return res.status(404).json({ message: 'Şirket bulunamadı.' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Şirket sil (Admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Şirket bulunamadı.' });
    }

    res.json({ message: 'Şirket silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

