# 📁 Proje Yapısı Detayları

## Backend Klasör Yapısı

```
backend/
├── config/
│   └── database.js          # MongoDB bağlantı yapılandırması
│
├── middleware/
│   └── auth.js              # JWT authentication ve admin kontrolü
│
├── models/
│   ├── User.js              # Kullanıcı modeli (name, email, password, role)
│   ├── Category.js          # Kategori modeli (name)
│   ├── Company.js           # Şirket modeli (categoryId, name, address, workingHours)
│   └── Appointment.js       # Randevu modeli (userId, companyId, date, time, status)
│
├── routes/
│   ├── auth.js              # POST /register, POST /login, GET /me
│   ├── categories.js        # GET, POST, PATCH, DELETE /categories
│   ├── companies.js         # GET, POST, PATCH, DELETE /companies
│   └── appointments.js      # GET /available, POST, GET /my, PATCH /cancel, PATCH /update
│
├── server.js                # Express server ve route tanımlamaları
├── seed.js                  # Örnek veri oluşturma script'i
├── package.json             # Bağımlılıklar ve script'ler
└── .env.example             # Ortam değişkenleri örneği
```

## Frontend Klasör Yapısı

```
frontend/
├── css/
│   └── styles.css           # Tüm stil tanımlamaları (responsive, modern UI)
│
├── js/
│   ├── api.js               # API helper fonksiyonları (fetch wrapper)
│   ├── auth.js              # Authentication yönetimi (login, register, logout)
│   └── app.js               # Ana uygulama mantığı (sayfa yönetimi, randevu işlemleri)
│
├── index.html               # SPA ana HTML dosyası (tüm sayfalar burada)
└── pages/                   # (Boş - SPA yapısı nedeniyle kullanılmıyor)
```

## API Endpoint Detayları

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| POST | `/register` | ❌ | Kullanıcı kaydı |
| POST | `/login` | ❌ | Kullanıcı girişi |
| GET | `/me` | ✅ | Kullanıcı bilgileri |

**Örnek Request:**
```javascript
// Register
POST /api/auth/register
Body: {
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "123456"
}

// Login
POST /api/auth/login
Body: {
  "email": "ahmet@example.com",
  "password": "123456"
}
```

### 📂 Categories (`/api/categories`)

| Method | Endpoint | Auth | Admin | Açıklama |
|--------|----------|------|-------|----------|
| GET | `/` | ❌ | ❌ | Tüm kategorileri getir |
| POST | `/` | ✅ | ✅ | Kategori oluştur |
| PATCH | `/:id` | ✅ | ✅ | Kategori güncelle |
| DELETE | `/:id` | ✅ | ✅ | Kategori sil |

**Örnek Request:**
```javascript
// Create Category (Admin)
POST /api/categories
Headers: { Authorization: "Bearer <token>" }
Body: { "name": "Berber" }
```

### 🏢 Companies (`/api/companies`)

| Method | Endpoint | Auth | Admin | Açıklama |
|--------|----------|------|-------|----------|
| GET | `/?categoryId=xxx` | ❌ | ❌ | Şirketleri getir (kategoriye göre) |
| POST | `/` | ✅ | ✅ | Şirket oluştur |
| PATCH | `/:id` | ✅ | ✅ | Şirket güncelle |
| DELETE | `/:id` | ✅ | ✅ | Şirket sil |

**Örnek Request:**
```javascript
// Create Company (Admin)
POST /api/companies
Headers: { Authorization: "Bearer <token>" }
Body: {
  "categoryId": "507f1f77bcf86cd799439011",
  "name": "Ahmet Barber",
  "address": "İstanbul, Kadıköy",
  "workingHours": {
    "start": "09:00",
    "end": "18:00"
  }
}
```

### 📅 Appointments (`/api/appointments`)

| Method | Endpoint | Auth | Admin | Açıklama |
|--------|----------|------|-------|----------|
| GET | `/available?companyId=xxx&date=YYYY-MM-DD` | ❌ | ❌ | Müsait saatleri getir |
| POST | `/` | ✅ | ❌ | Randevu oluştur |
| GET | `/my` | ✅ | ❌ | Kullanıcının randevularını getir |
| PATCH | `/cancel/:id` | ✅ | ❌ | Randevu iptal et |
| GET | `/all` | ✅ | ✅ | Tüm randevuları getir (Admin) |
| PATCH | `/update/:id` | ✅ | ✅ | Randevu durumu güncelle (Admin) |

**Örnek Request:**
```javascript
// Get Available Slots
GET /api/appointments/available?companyId=507f1f77bcf86cd799439011&date=2024-01-15

// Create Appointment
POST /api/appointments
Headers: { Authorization: "Bearer <token>" }
Body: {
  "companyId": "507f1f77bcf86cd799439011",
  "date": "2024-01-15",
  "time": "14:00"
}

// Update Appointment Status (Admin)
PATCH /api/appointments/update/507f1f77bcf86cd799439011
Headers: { Authorization: "Bearer <token>" }
Body: { "status": "approved" }
```

## Frontend Sayfa Yapısı

### 1. Ana Sayfa (Home Page)
- Kategori listesi gösterilir
- Kategori kartlarına tıklanarak şirketler sayfasına geçilir

### 2. Şirketler Sayfası (Companies Page)
- Seçilen kategoriye ait şirketler listelenir
- Şirket kartlarına tıklanarak saat seçim sayfasına geçilir

### 3. Saat Seçim Sayfası (Time Slots Page)
- Tarih seçici ile tarih seçilir
- Seçilen tarih için müsait saatler gösterilir
- Yeşil: Boş saat (seçilebilir)
- Kırmızı: Dolu saat (seçilemez)
- Boş bir saate tıklanarak randevu oluşturulur

### 4. Randevularım Sayfası (My Appointments)
- Kullanıcının tüm randevuları listelenir
- Randevu durumu gösterilir (Beklemede, Onaylandı, İptal Edildi)
- Beklemede veya onaylanmış randevular iptal edilebilir

### 5. Admin Paneli (Admin Panel)
- **Kategoriler Sekmesi:** Kategori ekleme, düzenleme, silme
- **Şirketler Sekmesi:** Şirket ekleme, düzenleme, silme
- **Randevular Sekmesi:** Tüm randevuları görüntüleme, onaylama, iptal etme

## Veritabanı İlişkileri

```
Category (1) ──< (N) Company (1) ──< (N) Appointment (N) >── (1) User
```

- Bir kategoriye birden fazla şirket bağlı olabilir
- Bir şirkete birden fazla randevu bağlı olabilir
- Bir kullanıcının birden fazla randevusu olabilir
- Her randevu bir kullanıcıya ve bir şirkete bağlıdır

## Güvenlik Özellikleri

1. **JWT Authentication:** Tüm korumalı endpoint'ler JWT token gerektirir
2. **Password Hashing:** Şifreler bcrypt ile hashlenir
3. **Admin Middleware:** Admin işlemleri için ayrı middleware kontrolü
4. **User Authorization:** Kullanıcılar sadece kendi randevularını görebilir/iptal edebilir
5. **Input Validation:** Tüm endpoint'lerde validasyon yapılır

## Örnek Kullanım Senaryoları

### Senaryo 1: Kullanıcı Randevu Alıyor
1. Ana sayfada "Berber" kategorisini seçer
2. "Ahmet Barber" şirketini seçer
3. Tarih seçer (örn: 2024-01-15)
4. Saatleri yükler, boş bir saat seçer (örn: 14:00)
5. Randevu oluşturulur (status: "pending")
6. Randevularım sayfasından randevusunu görür

### Senaryo 2: Admin Şirket Ekliyor
1. Admin paneline girer
2. "Şirketler" sekmesine geçer
3. Kategori seçer, şirket bilgilerini girer
4. Çalışma saatlerini belirler (09:00 - 18:00)
5. Şirket oluşturulur

### Senaryo 3: Admin Randevu Onaylıyor
1. Admin paneline girer
2. "Randevular" sekmesine geçer
3. Beklemede olan randevuları görür
4. "Onayla" butonuna tıklar
5. Randevu durumu "approved" olur

## CSS Renk Sistemi

```css
--primary-color: #4f46e5      /* Ana renk (mavi) */
--secondary-color: #10b981    /* Yeşil (boş saatler) */
--danger-color: #ef4444       /* Kırmızı (dolu saatler) */
--success-color: #10b981      /* Başarı mesajları */
--warning-color: #f59e0b      /* Uyarı mesajları */
```

## Responsive Tasarım

- **Desktop:** Grid layout, çok sütunlu görünüm
- **Tablet:** 2 sütunlu grid
- **Mobile:** Tek sütunlu, dikey düzen

## Notlar

- Frontend SPA (Single Page Application) yapısında çalışır
- Tüm sayfalar `index.html` içinde, JavaScript ile gösterilir/gizlenir
- API çağrıları `fetch()` ile yapılır
- Token localStorage'da saklanır
- Sayfa yenilendiğinde token kontrol edilir ve kullanıcı bilgileri yüklenir

