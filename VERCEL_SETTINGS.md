# Vercel Project Settings Kontrol Listesi

## ⚠️ ÖNEMLİ: Vercel Dashboard'da Bu Ayarları Kontrol Edin!

### 1. **Root Directory**
- Settings → General → Root Directory
- **Boş bırakın** veya **`.`** (nokta) yazın
- ❌ `backend` veya `frontend` yazmayın!

### 2. **Build & Development Settings**
- Settings → General → Build & Development Settings
- **Framework Preset:** `Other` veya `None`
- **Build Command:** Boş bırakın (Vercel otomatik algılayacak)
- **Output Directory:** Boş bırakın
- **Install Command:** `npm install` (root'ta çalışacak)

### 3. **Environment Variables**
- Settings → Environment Variables
- Şunları ekleyin:
  - `MONGODB_URI` → MongoDB Atlas connection string
  - `JWT_SECRET` → Random secret key (örn: `openssl rand -base64 32`)
  - `NODE_ENV` → `production`

### 4. **Deployment**
- Deployments → En son deployment
- "Redeploy" butonuna tıklayın
- "Use existing Build Cache" seçeneğini **KAPATIN** (ilk seferde)

## 🔍 Sorun Giderme

### SSL Hatası Devam Ediyorsa:

1. **Build Logs Kontrol:**
   - Deployments → En son deployment → "View Build Logs"
   - Hata var mı kontrol edin

2. **Function Logs Kontrol:**
   - Deployments → En son deployment → "Function Logs"
   - API çağrılarında hata var mı kontrol edin

3. **Test API:**
   ```
   https://randevu-sistem-app.vercel.app/api/health
   ```
   Bu çalışıyorsa API OK ✅

4. **Test Frontend:**
   ```
   https://randevu-sistem-app.vercel.app
   ```
   Bu açılıyorsa Frontend OK ✅

## 📝 Notlar

- `public/` klasörü otomatik serve edilir
- `api/` klasöründeki dosyalar serverless function olur
- Root'ta `package.json` olmalı (bağımlılıklar ile)

