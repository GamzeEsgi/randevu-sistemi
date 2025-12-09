# 🚀 Projeyi Yayınlama - Hızlı Başlangıç

## ⚡ En Hızlı Yöntem: Vercel (5 dakika)

### 1️⃣ GitHub'a Yükle

```bash
cd randevu-sistemi
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/KULLANICI_ADI/randevu-sistemi.git
git push -u origin main
```

### 2️⃣ Vercel'e Deploy

1. **https://vercel.com** → GitHub ile giriş
2. **"Add New Project"** → Repository seç
3. **Ayarlar:**
   - Framework: **Other**
   - Root Directory: **randevu-sistemi**
   - Build Command: **Boş**
   - Output Directory: **Boş**
   - Install Command: **cd backend && npm install**

4. **Environment Variables ekle:**
   ```
   MONGODB_URI=mongodb+srv://gamze27:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
   JWT_SECRET=randevu-sistemi-secret-key-2024-production
   PORT=5000
   NODE_ENV=production
   ```

5. **Deploy!** 🎉

### 3️⃣ MongoDB Atlas Network Access

1. MongoDB Atlas → **Network Access**
2. **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)
3. **Confirm**

---

## ✅ Hazır!

Vercel size bir URL verecek: `https://randevu-sistemi-xxxxx.vercel.app`

---

## 📚 Detaylı Rehber

Daha detaylı bilgi için `DEPLOY.md` ve `HIZLI_DEPLOY.md` dosyalarına bakın.

---

## 🔧 Sorun mu var?

- **Build hatası?** → `vercel.json` kontrol edin
- **MongoDB hatası?** → Network Access ayarlarını kontrol edin
- **404 hatası?** → Routes'ları kontrol edin

