# ⚡ Hızlı Başlangıç - MongoDB Atlas ile

## 1. MongoDB Atlas Hesabı Oluştur (2 dakika)

1. https://www.mongodb.com/cloud/atlas/register adresine gidin
2. Ücretsiz hesap oluşturun
3. "Build a Database" → "FREE" (M0) seçin
4. Cloud Provider: AWS, Region: en yakın bölge (örn: Europe - Frankfurt)
5. Cluster adı: "Cluster0" (varsayılan)
6. "Create" butonuna tıklayın (2-3 dakika sürebilir)

## 2. Database Kullanıcısı Oluştur

1. "Database Access" (sol menü) → "Add New Database User"
2. Authentication Method: "Password"
3. Username: `randevu-admin` (veya istediğiniz)
4. Password: Güçlü bir şifre oluşturun (kaydedin!)
5. Database User Privileges: "Atlas admin" veya "Read and write to any database"
6. "Add User"

## 3. Network Access Ayarla

1. "Network Access" (sol menü) → "Add IP Address"
2. "Allow Access from Anywhere" → `0.0.0.0/0` ekleyin
3. "Confirm"

## 4. Connection String Al

1. "Database" (sol menü) → "Connect"
2. "Connect your application" seçin
3. Driver: "Node.js", Version: "5.5 or later"
4. Connection string'i kopyalayın:
   ```
   mongodb+srv://randevu-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 5. .env Dosyasını Güncelle

`randevu-sistemi/backend/.env` dosyasını açın ve şunu değiştirin:

```env
# <password> kısmını yukarıda oluşturduğunuz şifreyle değiştirin
# /? kısmından sonra veritabanı adını ekleyin: /randevu-sistemi?
MONGODB_URI=mongodb+srv://randevu-admin:SIFRENIZ@cluster0.xxxxx.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
JWT_SECRET=randevu-sistemi-secret-key-2024
PORT=5000
```

**Örnek:**
```env
MONGODB_URI=mongodb+srv://randevu-admin:MySecurePass123@cluster0.abc123.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
```

## 6. Sunucuyu Başlat

```powershell
cd randevu-sistemi/backend
npm start
```

## 7. Örnek Verileri Yükle

Yeni bir terminal açın:

```powershell
cd randevu-sistemi/backend
npm run seed
```

## 8. Tarayıcıda Aç

```
http://localhost:5000
```

## Test Hesapları

- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123

---

## Sorun mu var?

- Connection string'deki `<password>` kısmını değiştirdiniz mi?
- Network Access'te IP eklediniz mi? (0.0.0.0/0)
- Cluster oluşturuldu mu? (2-3 dakika sürebilir)

