# Vercel Deploy Sorunu - Adım Adım Çözüm

## 🔍 Sorun Tespiti

Vercel'de SSL hatası veya site açılmıyor sorunu yaşıyorsanız:

### 1. Vercel Dashboard'da Kontrol Edin

**Deployments** sekmesine gidin:
- Son deployment'ın durumu ne? (Building, Ready, Error)
- Build log'larını açın ve hata var mı kontrol edin

### 2. Build Log'larında Yaygın Hatalar

#### Hata: "Cannot find module"
**Çözüm:** Install Command kontrol edin
- Vercel Settings → General
- **Install Command:** `cd backend && npm install`

#### Hata: "MongoDB connection failed"
**Çözüm:** Environment Variables kontrol edin
- Settings → Environment Variables
- `MONGODB_URI` doğru mu?
- MongoDB Atlas → Network Access → 0.0.0.0/0 eklenmiş mi?

#### Hata: "Module not found: express"
**Çözüm:** Root directory ve install command
- **Root Directory:** `randevu-sistemi` (veya boş)
- **Install Command:** `cd backend && npm install`

### 3. Vercel Proje Ayarları (Kritik!)

**Settings → General:**
```
Framework Preset: Other
Root Directory: randevu-sistemi (veya boş bırakın)
Build Command: (boş)
Output Directory: (boş)
Install Command: cd backend && npm install
```

### 4. Environment Variables (Mutlaka Ekleyin!)

**Settings → Environment Variables:**
```
MONGODB_URI = mongodb+srv://gamze27:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
JWT_SECRET = randevu-sistemi-secret-key-2024-production
PORT = 5000
NODE_ENV = production
```

### 5. MongoDB Atlas Network Access

1. MongoDB Atlas → Network Access
2. "Add IP Address"
3. "Allow Access from Anywhere" → `0.0.0.0/0`
4. "Confirm"

## 🔧 Manuel Test

Deploy tamamlandıktan sonra:

1. **API Test:**
   ```
   https://randevu-sistem-app.vercel.app/api/health
   ```
   Bu çalışıyorsa backend OK.

2. **Frontend Test:**
   ```
   https://randevu-sistem-app.vercel.app
   ```
   Bu açılıyorsa frontend OK.

## 🚨 Hala Çalışmıyorsa

### Alternatif 1: Render.com (Daha Kolay)

1. https://render.com → GitHub ile giriş
2. "New" → "Web Service"
3. Repository seçin
4. Ayarlar:
   - **Name:** randevu-sistemi
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Root Directory:** `randevu-sistemi`

### Alternatif 2: Railway.app

1. https://railway.app → GitHub ile giriş
2. "New Project" → "Deploy from GitHub repo"
3. Repository seçin
4. Environment variables ekleyin
5. Deploy!

## 📞 Hata Mesajını Paylaşın

Eğer hala çalışmıyorsa, Vercel Dashboard'dan:
1. Son deployment'ı açın
2. "View Build Logs" tıklayın
3. Hata mesajını kopyalayıp paylaşın

Bu şekilde daha spesifik çözüm sunabilirim.

