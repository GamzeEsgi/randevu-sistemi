# 🚀 Projeyi Yayınlama Rehberi

## Seçenek 1: Vercel (Önerilen - Ücretsiz ve Kolay)

### Adım 1: Vercel Hesabı Oluştur
1. https://vercel.com adresine gidin
2. "Sign Up" ile GitHub, GitLab veya Email ile hesap oluşturun

### Adım 2: Projeyi GitHub'a Yükleyin
1. GitHub'da yeni bir repository oluşturun
2. Projeyi GitHub'a push edin:

```bash
cd randevu-sistemi
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/KULLANICI_ADI/randevu-sistemi.git
git push -u origin main
```

### Adım 3: Vercel'e Deploy Edin

#### Yöntem A: Vercel Dashboard (Kolay)
1. https://vercel.com/dashboard adresine gidin
2. "Add New Project" tıklayın
3. GitHub repository'nizi seçin
4. **Root Directory:** `randevu-sistemi` seçin
5. **Framework Preset:** "Other" seçin
6. **Build Command:** Boş bırakın
7. **Output Directory:** `frontend` yazın
8. **Install Command:** `cd backend && npm install` yazın

#### Yöntem B: Vercel CLI (Hızlı)
```bash
# Vercel CLI kurulumu
npm i -g vercel

# Proje klasörüne git
cd randevu-sistemi

# Deploy
vercel

# Production'a deploy
vercel --prod
```

### Adım 4: Environment Variables Ayarlayın

Vercel Dashboard'da:
1. Projenize gidin
2. "Settings" → "Environment Variables"
3. Şu değişkenleri ekleyin:

```
MONGODB_URI=mongodb+srv://gamze27:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
JWT_SECRET=randevu-sistemi-secret-key-2024-production
PORT=5000
NODE_ENV=production
```

**Önemli:** Production için güçlü bir JWT_SECRET kullanın!

### Adım 5: vercel.json Dosyasını Güncelleyin

`vercel.json` dosyası zaten oluşturuldu. Eğer farklı bir yapı kullanıyorsanız güncelleyin.

### Adım 6: API Base URL'i Güncelleyin

Frontend'deki `api.js` dosyasını güncelleyin:

```javascript
// Production için
const API_BASE_URL = window.location.origin + '/api';

// Veya Vercel URL'iniz için
// const API_BASE_URL = 'https://your-project.vercel.app/api';
```

---

## Seçenek 2: Render (Alternatif)

### Adım 1: Render Hesabı
1. https://render.com adresine gidin
2. GitHub ile giriş yapın

### Adım 2: Yeni Web Service
1. "New" → "Web Service"
2. Repository'nizi seçin
3. Ayarlar:
   - **Name:** randevu-sistemi
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Root Directory:** `randevu-sistemi`

### Adım 3: Environment Variables
```
MONGODB_URI=...
JWT_SECRET=...
PORT=5000
```

---

## Seçenek 3: Railway (Alternatif)

1. https://railway.app adresine gidin
2. GitHub ile giriş yapın
3. "New Project" → "Deploy from GitHub repo"
4. Repository'nizi seçin
5. Environment variables ekleyin
6. Deploy!

---

## ⚠️ Önemli Notlar

### 1. MongoDB Atlas Network Access
Production için MongoDB Atlas'ta:
- Network Access → Add IP Address
- "Allow Access from Anywhere" (0.0.0.0/0) ekleyin

### 2. CORS Ayarları
Backend'de CORS zaten ayarlı, ancak production URL'lerini ekleyin:

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:5000',
    'https://your-project.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

### 3. Frontend API URL
Production'da frontend'in API'ye doğru bağlanması için:

```javascript
// frontend/js/api.js
const API_BASE_URL = window.location.origin + '/api';
```

### 4. Static Files
Vercel otomatik olarak `frontend` klasöründeki static dosyaları serve eder.

---

## 🎯 Hızlı Deploy (Vercel CLI)

```bash
# 1. Vercel CLI kur
npm i -g vercel

# 2. Proje klasörüne git
cd randevu-sistemi

# 3. Deploy
vercel

# 4. Environment variables ekle (vercel dashboard'dan veya CLI ile)
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add PORT

# 5. Production deploy
vercel --prod
```

---

## 📝 Custom Domain (Opsiyonel)

1. Vercel Dashboard → Projeniz → Settings → Domains
2. Domain'inizi ekleyin
3. DNS ayarlarını yapın

---

## ✅ Deploy Sonrası Kontrol

1. Site açılıyor mu?
2. API çalışıyor mu? (`https://your-site.vercel.app/api/health`)
3. Giriş yapılabiliyor mu?
4. MongoDB bağlantısı çalışıyor mu?

---

## 🐛 Sorun Giderme

### "Module not found" hatası
- `package.json`'da tüm dependencies var mı kontrol edin
- `node_modules` commit edilmemeli (.gitignore'da olmalı)

### MongoDB bağlantı hatası
- Network Access ayarlarını kontrol edin
- Connection string doğru mu?

### CORS hatası
- Backend'de CORS ayarlarını kontrol edin
- Production URL'lerini ekleyin

### 404 hatası
- `vercel.json` dosyası doğru mu?
- Route'lar doğru tanımlanmış mı?

---

## 📚 Daha Fazla Bilgi

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app

