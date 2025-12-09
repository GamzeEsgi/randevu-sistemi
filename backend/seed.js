const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const User = require('./models/User');
const Category = require('./models/Category');
const Company = require('./models/Company');

dotenv.config();

async function seed() {
    try {
        // Connect to database
        await connectDB();

        console.log('🌱 Seed işlemi başlatılıyor...');

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Company.deleteMany({});
        console.log('✅ Mevcut veriler temizlendi');

        // Create Admin User
        const admin = new User({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin kullanıcı oluşturuldu (admin@example.com / admin123)');

        // Create Regular User
        const user = new User({
            name: 'Test Kullanıcı',
            email: 'user@example.com',
            password: 'user123',
            role: 'user'
        });
        await user.save();
        console.log('✅ Test kullanıcı oluşturuldu (user@example.com / user123)');

        // Create Categories
        const categories = [
            { name: 'Berber' },
            { name: 'Kuaför' },
            { name: 'Klinik' },
            { name: 'Oto Servis' },
            { name: 'Spor Salonu' },
            { name: 'Doktor' },
            { name: 'Diş Hekimi' },
            { name: 'Veteriner' },
            { name: 'Güzellik Merkezi' },
            { name: 'Masaj & Spa' },
            { name: 'Fitness & Pilates' },
            { name: 'Yoga & Meditasyon' },
            { name: 'Eğitim & Kurs' },
            { name: 'Müzik Dersleri' },
            { name: 'Fotoğrafçı' },
            { name: 'Düğün Salonu' },
            { name: 'Catering' },
            { name: 'Temizlik Hizmeti' },
            { name: 'Tamirci' },
            { name: 'Elektrikçi' }
        ];

        const createdCategories = await Category.insertMany(categories);
        console.log('✅ Kategoriler oluşturuldu');

        // Create Companies
        const companies = [
            // Berber
            {
                categoryId: createdCategories[0]._id,
                name: 'Ahmet Barber',
                address: 'İstanbul, Kadıköy, Moda Caddesi No:123',
                workingHours: { start: '09:00', end: '18:00' }
            },
            {
                categoryId: createdCategories[0]._id,
                name: 'Erkek Kuaför Pro',
                address: 'Ankara, Çankaya, Kızılay Caddesi No:456',
                workingHours: { start: '08:00', end: '20:00' }
            },
            {
                categoryId: createdCategories[0]._id,
                name: 'Modern Barber Shop',
                address: 'İzmir, Konak, Alsancak Caddesi No:789',
                workingHours: { start: '10:00', end: '19:00' }
            },
            // Kuaför
            {
                categoryId: createdCategories[1]._id,
                name: 'Merve Hair Studio',
                address: 'İzmir, Konak, Alsancak Caddesi No:789',
                workingHours: { start: '10:00', end: '19:00' }
            },
            {
                categoryId: createdCategories[1]._id,
                name: 'Güzellik Salonu Elite',
                address: 'İstanbul, Şişli, Nişantaşı Caddesi No:234',
                workingHours: { start: '09:00', end: '20:00' }
            },
            // Klinik
            {
                categoryId: createdCategories[2]._id,
                name: 'Sağlık Klinik',
                address: 'Bursa, Nilüfer, Fomara Caddesi No:321',
                workingHours: { start: '08:00', end: '17:00' }
            },
            {
                categoryId: createdCategories[2]._id,
                name: 'Merkez Poliklinik',
                address: 'Ankara, Çankaya, Kızılay Caddesi No:567',
                workingHours: { start: '08:00', end: '18:00' }
            },
            // Oto Servis
            {
                categoryId: createdCategories[3]._id,
                name: 'Hızlı Oto Servis',
                address: 'Antalya, Muratpaşa, Atatürk Caddesi No:654',
                workingHours: { start: '09:00', end: '18:00' }
            },
            {
                categoryId: createdCategories[3]._id,
                name: 'Premium Oto Tamir',
                address: 'İstanbul, Ataşehir, Barbaros Mahallesi No:890',
                workingHours: { start: '08:00', end: '19:00' }
            },
            // Spor Salonu
            {
                categoryId: createdCategories[4]._id,
                name: 'FitZone Spor Salonu',
                address: 'İstanbul, Beşiktaş, Barbaros Bulvarı No:987',
                workingHours: { start: '06:00', end: '22:00' }
            },
            {
                categoryId: createdCategories[4]._id,
                name: 'Power Gym',
                address: 'Ankara, Çankaya, Bahçelievler Caddesi No:123',
                workingHours: { start: '06:00', end: '23:00' }
            },
            // Doktor
            {
                categoryId: createdCategories[5]._id,
                name: 'Dr. Mehmet Yılmaz - Dahiliye',
                address: 'İstanbul, Kadıköy, Bağdat Caddesi No:456',
                workingHours: { start: '09:00', end: '17:00' }
            },
            {
                categoryId: createdCategories[5]._id,
                name: 'Dr. Ayşe Demir - Kardiyoloji',
                address: 'Ankara, Çankaya, Tunalı Hilmi Caddesi No:789',
                workingHours: { start: '10:00', end: '16:00' }
            },
            // Diş Hekimi
            {
                categoryId: createdCategories[6]._id,
                name: 'Gülümseme Diş Kliniği',
                address: 'İstanbul, Şişli, Halaskargazi Caddesi No:321',
                workingHours: { start: '09:00', end: '18:00' }
            },
            {
                categoryId: createdCategories[6]._id,
                name: 'Modern Diş Hekimliği',
                address: 'İzmir, Karşıyaka, Bostanlı Caddesi No:654',
                workingHours: { start: '09:00', end: '19:00' }
            },
            // Veteriner
            {
                categoryId: createdCategories[7]._id,
                name: 'Hayvan Dostu Veteriner',
                address: 'İstanbul, Üsküdar, Bağlarbaşı Caddesi No:234',
                workingHours: { start: '09:00', end: '18:00' }
            },
            {
                categoryId: createdCategories[7]._id,
                name: 'Pet Care Veteriner Kliniği',
                address: 'Ankara, Keçiören, Etlik Caddesi No:567',
                workingHours: { start: '08:00', end: '20:00' }
            },
            // Güzellik Merkezi
            {
                categoryId: createdCategories[8]._id,
                name: 'Elite Güzellik Merkezi',
                address: 'İstanbul, Nişantaşı, Teşvikiye Caddesi No:890',
                workingHours: { start: '10:00', end: '20:00' }
            },
            {
                categoryId: createdCategories[8]._id,
                name: 'Luxury Beauty Center',
                address: 'Ankara, Çankaya, Kavaklıdere Caddesi No:123',
                workingHours: { start: '09:00', end: '19:00' }
            },
            // Masaj & Spa
            {
                categoryId: createdCategories[9]._id,
                name: 'Relax Spa & Wellness',
                address: 'İstanbul, Beşiktaş, Ortaköy Caddesi No:456',
                workingHours: { start: '10:00', end: '22:00' }
            },
            {
                categoryId: createdCategories[9]._id,
                name: 'Zen Masaj Merkezi',
                address: 'İzmir, Alsancak, Kordon Caddesi No:789',
                workingHours: { start: '11:00', end: '21:00' }
            },
            // Fitness & Pilates
            {
                categoryId: createdCategories[10]._id,
                name: 'Pilates Studio',
                address: 'İstanbul, Kadıköy, Moda Caddesi No:321',
                workingHours: { start: '07:00', end: '21:00' }
            },
            {
                categoryId: createdCategories[10]._id,
                name: 'Core Fitness',
                address: 'Ankara, Çankaya, Kızılay Caddesi No:654',
                workingHours: { start: '06:00', end: '22:00' }
            },
            // Yoga & Meditasyon
            {
                categoryId: createdCategories[11]._id,
                name: 'Yoga & Zen Studio',
                address: 'İstanbul, Üsküdar, Çengelköy Caddesi No:234',
                workingHours: { start: '08:00', end: '20:00' }
            },
            {
                categoryId: createdCategories[11]._id,
                name: 'Mindful Yoga Center',
                address: 'İzmir, Bornova, Evka-3 Caddesi No:567',
                workingHours: { start: '07:00', end: '19:00' }
            },
            // Eğitim & Kurs
            {
                categoryId: createdCategories[12]._id,
                name: 'Akademi Eğitim Merkezi',
                address: 'İstanbul, Bakırköy, Ataköy Caddesi No:890',
                workingHours: { start: '09:00', end: '18:00' }
            },
            {
                categoryId: createdCategories[12]._id,
                name: 'Başarı Kurs Merkezi',
                address: 'Ankara, Keçiören, Etlik Caddesi No:123',
                workingHours: { start: '08:00', end: '20:00' }
            },
            // Müzik Dersleri
            {
                categoryId: createdCategories[13]._id,
                name: 'Müzik Akademisi',
                address: 'İstanbul, Kadıköy, Moda Caddesi No:456',
                workingHours: { start: '10:00', end: '20:00' }
            },
            {
                categoryId: createdCategories[13]._id,
                name: 'Sanat Evi Müzik',
                address: 'Ankara, Çankaya, Bahçelievler Caddesi No:789',
                workingHours: { start: '09:00', end: '19:00' }
            },
            // Fotoğrafçı
            {
                categoryId: createdCategories[14]._id,
                name: 'Profesyonel Fotoğraf Stüdyosu',
                address: 'İstanbul, Şişli, Nişantaşı Caddesi No:321',
                workingHours: { start: '10:00', end: '19:00' }
            },
            {
                categoryId: createdCategories[14]._id,
                name: 'Anı Fotoğrafçılık',
                address: 'İzmir, Konak, Alsancak Caddesi No:654',
                workingHours: { start: '09:00', end: '18:00' }
            },
            // Düğün Salonu
            {
                categoryId: createdCategories[15]._id,
                name: 'Grand Düğün Salonu',
                address: 'İstanbul, Ataşehir, Barbaros Mahallesi No:234',
                workingHours: { start: '10:00', end: '23:00' }
            },
            {
                categoryId: createdCategories[15]._id,
                name: 'Luxury Wedding Hall',
                address: 'Ankara, Çankaya, Kavaklıdere Caddesi No:567',
                workingHours: { start: '11:00', end: '23:59' }
            },
            // Catering
            {
                categoryId: createdCategories[16]._id,
                name: 'Lezzet Catering',
                address: 'İstanbul, Üsküdar, Çengelköy Caddesi No:890',
                workingHours: { start: '08:00', end: '20:00' }
            },
            {
                categoryId: createdCategories[16]._id,
                name: 'Elite Catering Hizmetleri',
                address: 'Ankara, Çankaya, Kızılay Caddesi No:123',
                workingHours: { start: '07:00', end: '22:00' }
            },
            // Temizlik Hizmeti
            {
                categoryId: createdCategories[17]._id,
                name: 'Profesyonel Temizlik',
                address: 'İstanbul, Kadıköy, Moda Caddesi No:456',
                workingHours: { start: '08:00', end: '18:00' }
            },
            {
                categoryId: createdCategories[17]._id,
                name: 'Sparkle Temizlik',
                address: 'İzmir, Bornova, Evka-3 Caddesi No:789',
                workingHours: { start: '09:00', end: '17:00' }
            },
            // Tamirci
            {
                categoryId: createdCategories[18]._id,
                name: 'Hızlı Tamir Servisi',
                address: 'İstanbul, Ataşehir, Barbaros Mahallesi No:321',
                workingHours: { start: '08:00', end: '20:00' }
            },
            {
                categoryId: createdCategories[18]._id,
                name: 'Usta Tamirci',
                address: 'Ankara, Keçiören, Etlik Caddesi No:654',
                workingHours: { start: '09:00', end: '19:00' }
            },
            // Elektrikçi
            {
                categoryId: createdCategories[19]._id,
                name: 'Güvenli Elektrik',
                address: 'İstanbul, Üsküdar, Bağlarbaşı Caddesi No:234',
                workingHours: { start: '08:00', end: '18:00' }
            },
            {
                categoryId: createdCategories[19]._id,
                name: '24 Saat Elektrikçi',
                address: 'Ankara, Çankaya, Kızılay Caddesi No:567',
                workingHours: { start: '00:00', end: '23:59' }
            }
        ];

        await Company.insertMany(companies);
        console.log('✅ Şirketler oluşturuldu');

        console.log('\n🎉 Seed işlemi tamamlandı!');
        console.log('\n📝 Giriş Bilgileri:');
        console.log('   Admin: admin@example.com / admin123');
        console.log('   User:  user@example.com / user123');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed hatası:', error);
        process.exit(1);
    }
}

seed();

