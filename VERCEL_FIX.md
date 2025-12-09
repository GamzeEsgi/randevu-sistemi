# Vercel SSL/Deploy Sorunu Çözümü

## Sorun
`ERR_SSL_PROTOCOL_ERROR` - Site güvenli bağlantı sağlayamıyor

## Olası Nedenler ve Çözümler

### 1. Deploy Henüz Tamamlanmamış
- Vercel Dashboard → Deployments
- Son deployment'ın durumunu kontrol edin
- "Building" veya "Deploying" durumunda bekleyin

### 2. Build Hatası
- Vercel Dashboard → Deployments → Son deployment → "View Build Logs"
- Hata mesajlarını kontrol edin
- Genellikle:
  - `npm install` hatası
  - Module bulunamadı hatası
  - Environment variable eksik

### 3. Environment Variables Eksik
Vercel Dashboard → Settings → Environment Variables:
```
MONGODB_URI=mongodb+srv://gamze27:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
JWT_SECRET=randevu-sistemi-secret-key-2024-production
PORT=5000
NODE_ENV=production
```

### 4. Vercel Yapılandırması
**Project Settings → General:**
- **Framework Preset:** Other
- **Root Directory:** `randevu-sistemi` (veya boş)
- **Build Command:** Boş bırakın
- **Output Directory:** Boş bırakın
- **Install Command:** `cd backend && npm install`

### 5. MongoDB Bağlantı Sorunu
- MongoDB Atlas → Network Access → 0.0.0.0/0 eklenmiş mi?
- Connection string doğru mu?

## Hızlı Kontrol Listesi

- [ ] Deploy tamamlandı mı? (Vercel Dashboard)
- [ ] Build başarılı mı? (Build Logs kontrol)
- [ ] Environment variables eklendi mi?
- [ ] MongoDB Network Access ayarı yapıldı mı?
- [ ] vercel.json doğru mu?

## Test

Deploy tamamlandıktan sonra:
1. `https://randevu-sistem-app.vercel.app/api/health` - API çalışıyor mu?
2. `https://randevu-sistem-app.vercel.app` - Site açılıyor mu?

## Hala Çalışmıyorsa

1. Vercel Dashboard → Deployments → "Redeploy"
2. Build log'larını kontrol edin
3. Environment variables'ı tekrar kontrol edin

