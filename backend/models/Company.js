const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori gereklidir']
  },
  name: {
    type: String,
    required: [true, 'Şirket adı gereklidir'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Adres gereklidir'],
    trim: true
  },
  workingHours: {
    start: {
      type: String,
      required: [true, 'Başlangıç saati gereklidir'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı giriniz (HH:MM)']
    },
    end: {
      type: String,
      required: [true, 'Bitiş saati gereklidir'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı giriniz (HH:MM)']
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);

