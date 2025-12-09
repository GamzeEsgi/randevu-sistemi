const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Kullanıcı gereklidir']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Şirket gereklidir']
  },
  date: {
    type: String,
    required: [true, 'Tarih gereklidir'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Geçerli bir tarih formatı giriniz (YYYY-MM-DD)']
  },
  time: {
    type: String,
    required: [true, 'Saat gereklidir'],
    match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı giriniz (HH:MM)']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Aynı şirket, tarih ve saatte birden fazla randevu olmasını engelle
appointmentSchema.index({ companyId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

