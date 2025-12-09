# 📘 MongoDB Atlas Connection String Alma Rehberi

## 🎯 Adım Adım Talimatlar

### 1️⃣ MongoDB Atlas'a Giriş Yapın
- **https://www.mongodb.com/cloud/atlas** adresine gidin
- Hesabınıza giriş yapın (yoksa ücretsiz kayıt olun)

### 2️⃣ Cluster'ınızı Seçin
- Sol menüden **"Database"** veya **"Clusters"** sekmesine tıklayın
- Mevcut cluster'ınızı görüyorsanız, cluster kartına tıklayın
- Cluster yoksa **"Create"** butonuna tıklayıp yeni bir cluster oluşturun (ücretsiz M0 tier yeterli)

### 3️⃣ Connect Butonuna Tıklayın
- Cluster kartında **"Connect"** butonuna tıklayın
- Veya cluster'a tıklayıp açılan sayfada **"Connect"** butonunu bulun

### 4️⃣ Connection Method Seçin
- Açılan pencerede **"Connect your application"** seçeneğini seçin
- ⚠️ **"Connect using MongoDB Compass"** veya **"Connect using VS Code"** değil!

### 5️⃣ Connection String'i Kopyalayın
- **"Driver"** olarak **"Node.js"** seçili olmalı
- **"Version"** olarak en son sürüm seçili olmalı
- Aşağıda bir connection string göreceksiniz, örneğin:
  ```
  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

### 6️⃣ Connection String'i Düzenleyin

#### Örnek Orijinal String:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### Düzenlenmiş String (Vercel için):
```
mongodb+srv://KULLANICI_ADI:GERÇEK_ŞİFRE@cluster0.xxxxx.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
```

### 7️⃣ Değiştirilmesi Gerekenler:

#### a) `<username>` → Kullanıcı Adınız
- MongoDB Atlas → **"Database Access"** → Kullanıcı adınızı bulun
- Veya yeni kullanıcı oluşturun (aşağıda anlatıldı)

#### b) `<password>` → Şifreniz
- MongoDB Atlas → **"Database Access"** → Kullanıcının şifresini bilmeniz gerekir
- Şifreyi unuttuysanız, yeni bir kullanıcı oluşturun (aşağıda anlatıldı)

#### c) `xxxxx` → Cluster ID (genelde değiştirmenize gerek yok)
- Bu kısım zaten doğru gelir, değiştirmeyin

#### d) Database Adı Ekleme
- `@cluster0.xxxxx.mongodb.net/` sonrasına **`randevu-sistemi`** ekleyin
- Yani: `@cluster0.xxxxx.mongodb.net/randevu-sistemi?`

### 8️⃣ Kullanıcı Adı ve Şifre Nasıl Bulunur/Oluşturulur?

#### Mevcut Kullanıcıyı Bulma:
1. MongoDB Atlas → Sol menüden **"Database Access"** tıklayın
2. Kullanıcı listesinde kullanıcı adınızı görürsünüz
3. Şifreyi göremezsiniz (güvenlik nedeniyle)
4. Şifreyi unuttuysanız, kullanıcıya tıklayıp **"Edit"** → **"Edit Password"** ile değiştirebilirsiniz

#### Yeni Kullanıcı Oluşturma (Önerilen):
1. MongoDB Atlas → **"Database Access"** → **"Add New Database User"**
2. **"Password"** seçeneğini seçin
3. **"Username"** girin (örn: `randevu-user`)
4. **"Password"** girin (güçlü bir şifre, kaydedin!)
5. **"Database User Privileges"** → **"Atlas admin"** veya **"Read and write to any database"** seçin
6. **"Add User"** butonuna tıklayın

### 9️⃣ Network Access Ayarları (ÖNEMLİ!)

MongoDB Atlas'ta IP whitelist ayarları yapmanız gerekir:

1. MongoDB Atlas → Sol menüden **"Network Access"** tıklayın
2. **"Add IP Address"** butonuna tıklayın
3. **"Allow Access from Anywhere"** seçeneğini seçin (Vercel için gerekli)
   - Veya **"Add Current IP Address"** (sadece bilgisayarınızdan erişim için)
4. **"Confirm"** butonuna tıklayın

⚠️ **Vercel için "Allow Access from Anywhere" (0.0.0.0/0) seçmeniz gerekir!**

## 📝 Örnek Tam Connection String

### Örnek 1 (Yeni Kullanıcı ile):
```
mongodb+srv://randevu-user:MySecurePassword123@cluster0.abc123.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
```

### Örnek 2 (Mevcut Kullanıcı ile):
```
mongodb+srv://admin:AdminPassword456@cluster0.xyz789.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
```

## ✅ Vercel'e Ekleme

1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. **Key:** `MONGODB_URI`
3. **Value:** Yukarıdaki düzenlenmiş connection string'i yapıştırın
4. **Environment:** Production, Preview, Development (hepsini seçin)
5. **Save** butonuna tıklayın
6. **Deployments** → En son deployment → **"Redeploy"**

## 🔍 Test Etme

Connection string'i test etmek için:

1. Vercel Dashboard → **Deployments** → En son deployment → **"Function Logs"**
2. Bir API isteği yapın (örn: register)
3. Log'larda **"✅ MongoDB bağlantısı başarılı"** görüyorsanız → ✅ Başarılı!
4. **"❌ MongoDB bağlantı hatası"** görüyorsanız → Connection string'i kontrol edin

## 🐛 Yaygın Hatalar

### Hata 1: "Authentication failed"
- **Çözüm:** Kullanıcı adı veya şifre yanlış. Database Access'te kontrol edin.

### Hata 2: "IP not whitelisted"
- **Çözüm:** Network Access'te "Allow Access from Anywhere" (0.0.0.0/0) ekleyin.

### Hata 3: "Invalid connection string"
- **Çözüm:** Connection string'de `<username>` ve `<password>` kısımlarını gerçek değerlerle değiştirdiğinizden emin olun.

### Hata 4: "Database name not found"
- **Çözüm:** Connection string'e `/randevu-sistemi` eklediğinizden emin olun. MongoDB otomatik oluşturur, sorun değil.

## 💡 İpuçları

- Connection string'deki şifre özel karakterler içeriyorsa (örn: `@`, `#`, `%`), URL encode edin:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`
  - `=` → `%3D`

- Şifrenizde özel karakter yoksa, direkt kullanabilirsiniz.

- Connection string'i asla public repository'lerde paylaşmayın! Sadece Vercel Environment Variables'da saklayın.

