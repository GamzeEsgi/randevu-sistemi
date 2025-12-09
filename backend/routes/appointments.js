const express = require('express');
const Appointment = require('../models/Appointment');
const Company = require('../models/Company');
const { authenticate, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Müsait saatleri getir
router.get('/available', async (req, res) => {
  try {
    const { companyId, date } = req.query;

    if (!companyId || !date) {
      return res.status(400).json({ message: 'Şirket ID ve tarih gereklidir.' });
    }

    // Şirket bilgilerini al
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Şirket bulunamadı.' });
    }

    // O tarihte alınmış randevuları getir
    const appointments = await Appointment.find({
      companyId,
      date,
      status: { $in: ['pending', 'approved'] }
    });

    const bookedTimes = appointments.map(apt => apt.time);

    // Çalışma saatleri arasındaki tüm saatleri oluştur
    const [startHour, startMin] = company.workingHours.start.split(':').map(Number);
    const [endHour, endMin] = company.workingHours.end.split(':').map(Number);

    const availableSlots = [];
    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      
      availableSlots.push({
        time: timeString,
        available: !bookedTimes.includes(timeString)
      });

      // 30 dakika ekle
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour++;
      }
    }

    res.json({
      company: {
        id: company._id,
        name: company.name,
        workingHours: company.workingHours
      },
      date,
      slots: availableSlots
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Randevu oluştur
router.post('/', authenticate, async (req, res) => {
  try {
    const { companyId, date, time } = req.body;

    // Validasyon
    if (!companyId || !date || !time) {
      return res.status(400).json({ message: 'Şirket, tarih ve saat gereklidir.' });
    }

    // Şirket kontrolü
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Şirket bulunamadı.' });
    }

    // Çalışma saatleri kontrolü
    if (time < company.workingHours.start || time > company.workingHours.end) {
      return res.status(400).json({ message: 'Seçilen saat çalışma saatleri dışında.' });
    }

    // Aynı saatte randevu var mı kontrol et
    const existingAppointment = await Appointment.findOne({
      companyId,
      date,
      time,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Bu saat zaten dolu.' });
    }

    // Randevu oluştur
    const appointment = new Appointment({
      userId: req.user._id,
      companyId,
      date,
      time,
      status: 'pending'
    });

    await appointment.save();
    await appointment.populate('companyId', 'name address');
    await appointment.populate('userId', 'name email');

    res.status(201).json(appointment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bu saat zaten dolu.' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcının randevularını getir
router.get('/my', authenticate, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('companyId', 'name address')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Randevu iptal et (Kullanıcı)
router.patch('/cancel/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Randevu bulunamadı.' });
    }

    // Kullanıcı sadece kendi randevusunu iptal edebilir
    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu randevuyu iptal etme yetkiniz yok.' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Randevu iptal edildi.', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Randevu güncelle (Admin - onayla/reddet)
router.patch('/update/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum.' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('companyId', 'name address')
      .populate('userId', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Randevu bulunamadı.' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tüm randevuları getir (Admin)
router.get('/all', authenticate, isAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('companyId', 'name address')
      .populate('userId', 'name email')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

