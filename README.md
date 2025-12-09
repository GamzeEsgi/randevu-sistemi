# 📅 Randevu Sistemi

Kategori → Şirket → Randevu Saatleri mantığıyla çalışan detaylı bir randevu sistemi.

## 🎯 Özellikler

### Kullanıcı Özellikleri
- ✅ Kategori listesinden seçim yapma
- ✅ Seçilen kategoriye ait şirketleri görüntüleme
- ✅ Şirket seçildiğinde günlük randevu saatlerini görüntüleme
- ✅ Boş/Dolu saat bilgisi görüntüleme (Yeşil: Boş, Kırmızı: Dolu)
- ✅ Boş bir saat seçip randevu oluşturma
- ✅ Kendi randevularını görüntüleme
- ✅ Randevularını iptal etme

### Admin Özellikleri
- ✅ Kategori ekleme / silme / güncelleme
- ✅ Şirket ekleme / silme / güncelleme
- ✅ Şirket çalışma saatleri belirleme
- ✅ Randevuları listeleme (tarih, kullanıcı, saat, durum)
- ✅ Randevuyu onaylama / reddetme / iptal etme

## 🛠️ Teknolojiler

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (Kimlik doğrulama)
- **bcryptjs** (Şifre hashleme)

### Frontend
- **HTML** + **CSS** + **Vanilla JavaScript**
- **fetch()** API ile backend bağlantısı
- Responsive tasarım

## 📁 Proje Yapısı

```
randevu-sistemi/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB bağlantı yapılandırması
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # Kullanıcı modeli
│   │   ├── Category.js          # Kategori modeli
│   │   ├── Company.js           # Şirket modeli
│   │   └── Appointment.js      # Randevu modeli
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── categories.js       # Kategori endpoints
│   │   ├── companies.js        # Şirket endpoints
│   │   └── appointments.js     # Randevu endpoints
│   ├── server.js               # Express server
│   ├── seed.js                 # Örnek veri oluşturma
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── css/
│   │   └── styles.css          # Ana stil dosyası
│   ├── js/
│   │   ├── api.js              # API helper fonksiyonları
│   │   ├── auth.js             # Authentication yönetimi
│   │   └── app.js              # Ana uygulama mantığı
│   ├── index.html              # Ana HTML dosyası
│   └── pages/                  # (Boş - SPA yapısı)
└── README.md
```

## 🚀 Kurulum

### 1. Gereksinimler
- Node.js (v14 veya üzeri)
- MongoDB (yerel veya MongoDB Atlas)

### 2. Backend Kurulumu

```bash
# Backend klasörüne git
cd randevu-sistemi/backend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle (MongoDB URI ve JWT_SECRET)
# MONGODB_URI=mongodb://localhost:27017/randevu-sistemi
# JWT_SECRET=your-secret-key-here
```

### 3. Veritabanı Kurulumu

**Yerel MongoDB:**
```bash
# MongoDB'nin çalıştığından emin olun
mongod
```

**MongoDB Atlas:**
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Cluster oluşturun
3. Connection string'i alın
4. `.env` dosyasına ekleyin

### 4. Örnek Verileri Yükleme

```bash
# Seed script'ini çalıştır
npm run seed
```

Bu komut şunları oluşturur:
- Admin kullanıcı: `admin@example.com` / `admin123`
- Test kullanıcı: `user@example.com` / `user123`
- Örnek kategoriler ve şirketler

### 5. Sunucuyu Başlatma

```bash
# Development modunda (nodemon ile)
npm run dev

# Production modunda
npm start
```

Sunucu `http://localhost:5000` adresinde çalışacak.

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Kullanıcı bilgileri (Auth gerekli)

### Categories
- `GET /api/categories` - Tüm kategorileri getir
- `POST /api/categories` - Kategori oluştur (Admin)
- `PATCH /api/categories/:id` - Kategori güncelle (Admin)
- `DELETE /api/categories/:id` - Kategori sil (Admin)

### Companies
- `GET /api/companies?categoryId=xxx` - Şirketleri getir (kategoriye göre filtreleme)
- `POST /api/companies` - Şirket oluştur (Admin)
- `PATCH /api/companies/:id` - Şirket güncelle (Admin)
- `DELETE /api/companies/:id` - Şirket sil (Admin)

### Appointments
- `GET /api/appointments/available?companyId=xxx&date=YYYY-MM-DD` - Müsait saatleri getir
- `POST /api/appointments` - Randevu oluştur (Auth gerekli)
- `GET /api/appointments/my` - Kullanıcının randevularını getir (Auth gerekli)
- `PATCH /api/appointments/cancel/:id` - Randevu iptal et (Auth gerekli)
- `GET /api/appointments/all` - Tüm randevuları getir (Admin)
- `PATCH /api/appointments/update/:id` - Randevu durumu güncelle (Admin)

## 🎨 Kullanım Örnekleri

### Frontend API Kullanımı

```javascript
// Kategori listesi getir
const categories = await api.categories.getAll();

// Şirket listesi getir (kategoriye göre)
const companies = await api.companies.getAll(categoryId);

// Müsait saatleri getir
const data = await api.appointments.getAvailable(companyId, '2024-01-15');

// Randevu oluştur
await api.appointments.create(companyId, '2024-01-15', '14:00');

// Kendi randevularımı getir
const myAppointments = await api.appointments.getMy();
```

### Backend API Örneği

```javascript
// Kategori oluşturma (Admin)
POST /api/categories
Headers: { Authorization: "Bearer <token>" }
Body: { "name": "Berber" }

// Randevu oluşturma
POST /api/appointments
Headers: { Authorization: "Bearer <token>" }
Body: {
  "companyId": "507f1f77bcf86cd799439011",
  "date": "2024-01-15",
  "time": "14:00"
}
```

## 🔐 Güvenlik

- JWT token ile kimlik doğrulama
- Şifreler bcrypt ile hashleniyor
- Admin yetkisi kontrolü
- Kullanıcılar sadece kendi randevularını görebilir/iptal edebilir
- Tüm endpoint'lerde validasyon

## 🎯 Veritabanı Modelleri

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "admin"
}
```

### Category
```javascript
{
  name: String (unique)
}
```

### Company
```javascript
{
  categoryId: ObjectId (ref: Category),
  name: String,
  address: String,
  workingHours: {
    start: "09:00",
    end: "18:00"
  }
}
```

### Appointment
```javascript
{
  userId: ObjectId (ref: User),
  companyId: ObjectId (ref: Company),
  date: "YYYY-MM-DD",
  time: "HH:MM",
  status: "pending" | "approved" | "cancelled"
}
```

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası
- MongoDB'nin çalıştığından emin olun
- `.env` dosyasındaki `MONGODB_URI` değerini kontrol edin
- MongoDB Atlas kullanıyorsanız IP whitelist'i kontrol edin

### JWT Token Hatası
- `.env` dosyasında `JWT_SECRET` tanımlı olduğundan emin olun
- Token'ın süresi dolmuş olabilir (7 gün)

### Port Hatası
- Port 5000 kullanılıyorsa `.env` dosyasında `PORT` değerini değiştirin

## 📝 Lisans

Bu proje eğitim amaçlıdır.

## 👨‍💻 Geliştirici Notları

- Frontend SPA (Single Page Application) yapısında çalışıyor
- Tüm sayfalar `index.html` içinde, JavaScript ile gösteriliyor/gizleniyor
- API çağrıları `fetch()` ile yapılıyor
- Responsive tasarım mevcut
- Modern CSS (CSS Variables, Flexbox, Grid) kullanılıyor

## 🚀 Deployment

### Vercel/Netlify
Backend'i Vercel'e deploy edebilirsiniz. `vercel.json` dosyası eklenebilir.

### MongoDB Atlas
Production için MongoDB Atlas kullanmanız önerilir.

---

**Not:** Production ortamında mutlaka güçlü bir `JWT_SECRET` kullanın ve `.env` dosyasını `.gitignore`'a ekleyin!

