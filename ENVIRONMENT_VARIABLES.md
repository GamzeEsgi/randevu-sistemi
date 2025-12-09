# 🔐 Vercel Environment Variables

## ⚠️ ÖNEMLİ: Vercel Dashboard'da Bu Değişkenleri Ekleyin!

### 1. Vercel Dashboard'a Gidin
- Projeniz → **Settings** → **Environment Variables**

### 2. Şu Değişkenleri Ekleyin:

#### ✅ `MONGODB_URI` (ZORUNLU)
```
mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.xxxxx.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
```
- MongoDB Atlas'tan alın
- `KULLANICI_ADI` ve `ŞİFRE` kısmını değiştirin
- `xxxxx` kısmını cluster ID'nizle değiştirin

#### ✅ `JWT_SECRET` (ZORUNLU)
```
abc123secret456xyz789
```
- Herhangi bir random string olabilir
- En az 32 karakter önerilir
- Örnek: `openssl rand -base64 32` komutuyla oluşturabilirsiniz

#### ✅ `NODE_ENV` (OPSIYONEL)
```
production
```

### 3. Environment'ı Seçin
- **Production** ✅
- **Preview** ✅
- **Development** ✅

### 4. Kaydedin ve Redeploy
- "Save" butonuna tıklayın
- **Deployments** → En son deployment → **"Redeploy"**
- "Use existing Build Cache" seçeneğini **KAPATIN**

## 🔍 MongoDB Atlas Connection String Nasıl Bulunur?

1. **MongoDB Atlas** → **Clusters** → Cluster'ınıza tıklayın
2. **"Connect"** butonuna tıklayın
3. **"Connect your application"** seçeneğini seçin
4. Connection string'i kopyalayın
5. `<password>` kısmını gerçek şifrenizle değiştirin
6. `<dbname>` kısmını `randevu-sistemi` ile değiştirin

## ✅ Test

Deploy tamamlandıktan sonra:

1. **API Health:**
   ```
   https://randevu-sistem-app.vercel.app/api/health
   ```

2. **Register Test:**
   - Frontend'den kayıt olmayı deneyin
   - Hata varsa Vercel Dashboard → **Function Logs** kontrol edin

## 🐛 Hata Devam Ediyorsa

Vercel Dashboard → **Deployments** → En son deployment → **"Function Logs"**:
- MongoDB bağlantı hatası görüyorsanız → `MONGODB_URI` kontrol edin
- JWT hatası görüyorsanız → `JWT_SECRET` kontrol edin
- Module not found → Root `package.json` kontrol edin

