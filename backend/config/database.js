const mongoose = require('mongoose');

// Vercel serverless için connection caching
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Eğer zaten bağlıysa ve bağlantı aktifse, mevcut bağlantıyı kullan
  if (cached.conn) {
    // Bağlantının hala aktif olduğunu kontrol et
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    } else {
      // Bağlantı kopmuş, temizle
      cached.conn = null;
    }
  }

  // Eğer bağlantı kuruluyorsa, promise'i bekle
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 saniye timeout
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/randevu-sistemi', opts).then((mongoose) => {
      console.log('✅ MongoDB bağlantısı başarılı');
      cached.conn = mongoose;
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB bağlantı hatası:', error.message);
      cached.promise = null; // Hata durumunda promise'i temizle
      cached.conn = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
