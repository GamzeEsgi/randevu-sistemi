# ⚡ Hızlı Deploy Rehberi (Vercel)

## 🚀 5 Dakikada Deploy!

### Adım 1: GitHub'a Yükle (2 dakika)

```bash
cd randevu-sistemi

# Git başlat (eğer yoksa)
git init

# Tüm dosyaları ekle
git add .

# Commit
git commit -m "Initial commit - Randevu Sistemi"

# GitHub'da yeni repo oluştur, sonra:
git remote add origin https://github.com/KULLANICI_ADI/randevu-sistemi.git
git branch -M main
git push -u origin main
```

### Adım 2: Vercel'e Deploy (3 dakika)

1. **Vercel'e Git:** https://vercel.com
2. **GitHub ile Giriş Yap**
3. **"Add New Project"** tıklayın
4. **Repository Seçin:** `randevu-sistemi`
5. **Ayarlar:**
   - **Framework Preset:** Other
   - **Root Directory:** `randevu-sistemi` (veya boş bırakın)
   - **Build Command:** Boş bırakın
   - **Output Directory:** Boş bırakın
   - **Install Command:** `cd backend && npm install`

6. **"Environment Variables"** bölümüne tıklayın ve ekleyin:

```
MONGODB_URI = mongodb+srv://gamze27:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
JWT_SECRET = randevu-sistemi-secret-key-2024-production
PORT = 5000
NODE_ENV = production
```

7. **"Deploy"** butonuna tıklayın!

### Adım 3: MongoDB Atlas Network Access

1. MongoDB Atlas → Network Access
2. "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
3. "Confirm"

### ✅ Hazır!

Deploy tamamlandıktan sonra Vercel size bir URL verecek:
`https://randevu-sistemi-xxxxx.vercel.app`

---

## 🔧 Sorun Giderme

### Build hatası?
- `vercel.json` dosyası doğru mu kontrol edin
- Environment variables eklendi mi?

### MongoDB bağlantı hatası?
- Network Access ayarlarını kontrol edin
- Connection string doğru mu?

### 404 hatası?
- `vercel.json` routes doğru mu?
- Frontend dosyaları doğru yerde mi?

---

## 📝 Önemli Notlar

1. **JWT_SECRET:** Production için güçlü bir secret kullanın!
2. **MongoDB:** Network Access'te 0.0.0.0/0 eklenmiş olmalı
3. **Git:** `.env` dosyasını commit etmeyin (zaten .gitignore'da)

---

## 🎯 Sonraki Adımlar

- Custom domain ekleyin (Vercel Dashboard → Settings → Domains)
- SSL otomatik olarak eklenir
- Her push'ta otomatik deploy olur

