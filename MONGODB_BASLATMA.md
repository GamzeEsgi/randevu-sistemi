# 🚀 MongoDB Başlatma Rehberi

## Sorun
Sunucu MongoDB bağlantısı olmadan çalışmıyor. MongoDB'yi başlatmanız gerekiyor.

## Çözüm 1: Yerel MongoDB Başlatma (Windows)

### MongoDB Kurulu mu?
```powershell
# MongoDB'nin kurulu olup olmadığını kontrol edin
where.exe mongod
```

### MongoDB Servisini Başlat
```powershell
# Yönetici olarak PowerShell açın ve:
net start MongoDB

# Veya MongoDB servis adı farklıysa:
Get-Service | Where-Object {$_.Name -like "*mongo*"}
# Bulduğunuz servis adını kullanın:
net start <SERVIS_ADI>
```

### MongoDB'yi Manuel Başlat
Eğer servis yoksa, MongoDB'yi manuel başlatın:

```powershell
# MongoDB veri klasörünü oluşturun (ilk kez)
New-Item -ItemType Directory -Force -Path "C:\data\db"

# MongoDB'yi başlatın
mongod --dbpath "C:\data\db"
```

## Çözüm 2: MongoDB Atlas (Önerilen - Ücretsiz)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun (ücretsiz)
2. "Build a Database" → "Free" seçin
3. Cluster oluşturun (birkaç dakika sürer)
4. "Connect" → "Connect your application" → Connection string'i kopyalayın
5. `.env` dosyasını güncelleyin:

```env
MONGODB_URI=mongodb+srv://kullaniciadi:sifre@cluster0.xxxxx.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
JWT_SECRET=randevu-sistemi-secret-key-2024
PORT=5000
```

**Not:** Connection string'deki `<password>` kısmını gerçek şifrenizle değiştirin.

## Çözüm 3: Docker ile MongoDB (Hızlı)

Docker kuruluysa:

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## MongoDB Başlatıldıktan Sonra

1. Sunucuyu başlatın:
```powershell
cd randevu-sistemi/backend
npm start
```

2. Örnek verileri yükleyin (ilk kez):
```powershell
npm run seed
```

3. Tarayıcıda açın:
```
http://localhost:5000
```

## Test Hesapları (seed'den sonra)
- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123

## Sorun Giderme

### Port 27017 kullanımda hatası
```powershell
# Port'u kullanan process'i bulun
netstat -ano | findstr :27017

# Process'i durdurun (PID'yi yukarıdaki komuttan alın)
taskkill /PID <PID> /F
```

### MongoDB bağlantı hatası
- MongoDB'nin çalıştığından emin olun
- Firewall'un 27017 portunu engellemediğinden emin olun
- MongoDB Atlas kullanıyorsanız IP whitelist'e ekleyin (0.0.0.0/0 - tüm IP'ler)

