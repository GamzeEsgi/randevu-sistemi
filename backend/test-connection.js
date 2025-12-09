const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function testConnection() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/randevu-sistemi';
    console.log('🔄 MongoDB bağlantısı test ediliyor...');
    console.log('📍 URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Şifreyi gizle
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB bağlantısı başarılı!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
    console.log('\n💡 Çözüm önerileri:');
    console.log('1. MongoDB servisini başlatın: net start MongoDB');
    console.log('2. Veya MongoDB Atlas kullanın ve .env dosyasını güncelleyin');
    process.exit(1);
  }
}

testConnection();

