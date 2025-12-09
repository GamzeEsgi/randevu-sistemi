const mongoose = require('mongoose');

// Vercel serverless için connection caching
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Eğer zaten bağlıysa, mevcut bağlantıyı kullan
  if (cached.conn) {
    return cached.conn;
  }

  // Eğer bağlantı kuruluyorsa, promise'i bekle
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/randevu-sistemi', opts).then((mongoose) => {
      console.log('✅ MongoDB bağlantısı başarılı');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB bağlantı hatası:', error.message);
      cached.promise = null; // Hata durumunda promise'i temizle
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
