# 🔍 MongoDB Atlas Kullanıcı Adı ve Şifre Nasıl Bulunur?

## 1. MongoDB Atlas'a Giriş Yapın

https://cloud.mongodb.com adresine gidin ve giriş yapın.

## 2. Kullanıcı Adınızı Bulun

1. Sol menüden **"Database Access"** (veya **"Security" → "Database Access"**) tıklayın
2. Burada tüm database kullanıcılarınızı göreceksiniz
3. Kullanıcı adınızı not edin (örn: `admin`, `myuser`, `randevu-admin`)

## 3. Şifrenizi Bulun

**Önemli:** MongoDB Atlas şifreleri güvenlik nedeniyle gösterilmez. Şifrenizi hatırlamıyorsanız:

### Seçenek A: Şifreyi Hatırlıyorsanız
- İlk oluşturduğunuzda kaydettiğiniz şifreyi kullanın
- Başka bir projede kullandığınız şifreyi deneyin

### Seçenek B: Yeni Kullanıcı Oluşturun (Önerilen)

1. **"Database Access"** sayfasında **"Add New Database User"** butonuna tıklayın
2. **Authentication Method:** "Password" seçin
3. **Username:** Yeni bir kullanıcı adı girin (örn: `randevu-user`)
4. **Password:** Güçlü bir şifre oluşturun ve **MUTLAKA KAYDEDİN!**
5. **Database User Privileges:** "Atlas admin" veya "Read and write to any database" seçin
6. **"Add User"** butonuna tıklayın

### Seçenek C: Mevcut Kullanıcının Şifresini Sıfırlayın

1. **"Database Access"** sayfasında kullanıcıyı bulun
2. Kullanıcının yanındaki **"Edit"** (kalem ikonu) tıklayın
3. **"Edit Password"** tıklayın
4. Yeni şifre oluşturun ve **MUTLAKA KAYDEDİN!**
5. **"Update User"** tıklayın

## 4. Connection String'i Güncelleyin

Kullanıcı adı ve şifreyi aldıktan sonra:

1. `randevu-sistemi/backend/.env` dosyasını açın
2. Şu satırı bulun:
   ```
   MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.1lpagmv.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
   ```
3. `<db_username>` yerine kullanıcı adınızı yazın
4. `<db_password>` yerine şifrenizi yazın

**Örnek:**
```
MONGODB_URI=mongodb+srv://randevu-user:MySecurePass123@cluster0.1lpagmv.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
```

## 5. Network Access Kontrolü

Connection string'i güncelledikten sonra:

1. Sol menüden **"Network Access"** tıklayın
2. **"Add IP Address"** butonuna tıklayın
3. **"Allow Access from Anywhere"** seçin (veya `0.0.0.0/0` yazın)
4. **"Confirm"** tıklayın

Bu olmadan bağlantı çalışmaz!

## 6. Test Edin

```powershell
cd randevu-sistemi/backend
npm start
```

Başarılı olursa şunu göreceksiniz:
```
✅ MongoDB bağlantısı başarılı
🚀 Server http://localhost:5000 adresinde çalışıyor
```

---

## 💡 İpucu

Eğer başka bir projede MongoDB Atlas kullanıyorsanız:
- O projedeki `.env` dosyasına bakın
- Veya o projede çalışan connection string'i kopyalayın
- Sadece veritabanı adını değiştirin (`/randevu-sistemi?`)

