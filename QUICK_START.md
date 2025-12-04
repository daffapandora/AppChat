# ⚡ Quick Start Guide - AppChat

## 🚀 Langkah Cepat untuk Running Project

### Prerequisites
- Node.js >= 20
- JDK 17
- Android Studio dengan Android SDK
- Android Emulator atau Physical Device

---

## 📱 Setup dalam 5 Menit

### Step 1: Clone & Install (2 menit)

```bash
# Clone repository
git clone https://github.com/daffapandora/AppChat.git
cd AppChat

# Install dependencies
npm install
```

### Step 2: Download google-services.json (1 menit)

**PENTING:** File ini diperlukan untuk Firebase!

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project: **aplikasi-chat-59dab**
3. Klik icon **⚙️** (Settings) → **Project settings**
4. Scroll ke bawah ke section **"Your apps"**
5. Klik pada app **Android** yang sudah ada
6. Klik **Download google-services.json**
7. **Copy file tersebut ke:** `AppChat/android/app/google-services.json`

**Verifikasi lokasi file:**
```bash
# File harus ada di path ini:
AppChat/
└── android/
    └── app/
        └── google-services.json  ← File harus di sini!
```

### Step 3: Run Application (2 menit)

**Terminal 1 - Start Metro Bundler:**
```bash
npm start
```

**Terminal 2 - Run Android App:**
```bash
npm run android
```

Atau:
```bash
npx react-native run-android
```

---

## ✅ Verification Checklist

Pastikan semua ini sudah OK:

- [ ] `npm install` berhasil tanpa error
- [ ] File `google-services.json` ada di `android/app/`
- [ ] Android Emulator atau Device sudah running
- [ ] `npm start` berjalan tanpa error
- [ ] App muncul di device/emulator

---

## 🎯 Testing the App

### 1. Register User Baru
1. App terbuka → Klik **"Belum punya akun? Daftar di sini"**
2. Isi form:
   - Email: `test@example.com`
   - Nama Tampilan: `Test User`
   - Password: `test123`
   - Konfirmasi Password: `test123`
3. Klik **"Daftar"**
4. Jika sukses → Langsung masuk ke Chat Room

### 2. Test Auto-Login
1. Tutup app (swipe dari recent apps)
2. Buka app lagi
3. Seharusnya **langsung masuk** ke Chat Room (tidak perlu login)

### 3. Send Message
1. Di Chat Room, ketik pesan: "Hello from AppChat!"
2. Klik **"Kirim"**
3. Pesan muncul di bubble **biru** (my message)

### 4. Upload Image
1. Klik icon **📷** (kamera)
2. Pilih gambar dari galeri
3. Preview muncul
4. Klik **"Kirim"**
5. Gambar terkirim ke chat

### 5. Test Offline Mode
1. Matikan WiFi/Data di device
2. Header berubah jadi **"🔴 Offline"**
3. Kirim pesan
4. Alert: "Mode Offline"
5. Pesan tersimpan dengan label **"Belum tersinkronisasi"**
6. Nyalakan WiFi/Data
7. Pesan otomatis sync ke server

### 6. Test dengan 2 Users (Optional)
1. Register user kedua di device/emulator lain
2. Kirim pesan dari user 1
3. Pesan langsung muncul di user 2 (real-time!)

---

## 🐛 Common Issues & Quick Fixes

### Issue 1: "google-services.json not found"

**Solusi:**
```bash
# Verifikasi file ada
ls android/app/google-services.json

# Jika tidak ada, download dari Firebase Console
# Copy ke android/app/google-services.json
```

### Issue 2: "Task :app:processDebugGoogleServices failed"

**Penyebab:** Package name tidak match

**Solusi:**
1. Cek `android/app/src/main/AndroidManifest.xml`
2. Package name harus: `com.appchat`
3. Jika beda, download ulang `google-services.json` dengan package name yang benar

### Issue 3: Metro Bundler Error

**Solusi:**
```bash
npx react-native start --reset-cache
```

### Issue 4: Gradle Build Failed

**Solusi:**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue 5: Cannot Connect to Metro

**Solusi:**
```bash
# Terminal 1 (harus tetap running)
npm start

# Terminal 2 (di window terpisah)
npm run android
```

### Issue 6: Image Picker Not Working

**Solusi:**
- Beri permission di device settings
- Atau rebuild app:
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

---

## 📊 Firebase Configuration Verification

**Cek Firebase Console:**

1. **Authentication** → Sign-in method → Email/Password harus **Enabled**
2. **Firestore Database** → Database harus sudah **Created**
3. **Storage** → Storage bucket harus sudah **Created**

**Test Firebase Connection:**
1. Register user baru di app
2. Cek Firebase Console → Authentication → Users
3. User baru harus muncul di list

---

## 🚀 Project Status

| Component | Status |
|-----------|--------|
| Firebase Config | ✅ Ready |
| Dependencies | ✅ Complete |
| Android Config | ✅ Complete |
| Gradle | ✅ v8.13 |
| Google Services | ✅ v4.4.4 |
| Permissions | ✅ All Added |
| Code | ✅ Bug-free |
| Documentation | ✅ Complete |

**Status: READY TO USE!** 🎉

---

## 📚 Full Documentation

Untuk dokumentasi lengkap:

- **README.md** - Project overview dan features
- **SETUP_GUIDE.md** - Detailed step-by-step setup
- **FEATURES.md** - Technical implementation details
- **FIREBASE_CONFIG_TEMPLATE.md** - Security best practices

---

## 📦 What's Included

### Features ✅
- [x] Email/Password Authentication
- [x] Auto-login
- [x] Real-time Messaging
- [x] Offline Mode with Local Storage
- [x] Image Upload
- [x] Network Status Indicator
- [x] Modern UI/UX
- [x] Error Handling

### Screens ✅
- [x] Login Screen
- [x] Registration Screen
- [x] Chat Room Screen

### Technologies ✅
- React Native 0.82
- TypeScript
- Firebase (Auth, Firestore, Storage)
- AsyncStorage
- NetInfo
- React Navigation
- Image Picker

---

## ✅ Final Checklist

Sebelum submit tugas:

- [ ] App bisa register user baru
- [ ] App bisa login
- [ ] Auto-login works
- [ ] Bisa send text message
- [ ] Bisa upload image
- [ ] Offline mode works
- [ ] Messages sync saat online
- [ ] Logout works
- [ ] No crashes or bugs

---

## 🎉 Done!

Jika semua checklist ✅, aplikasi kamu **siap digunakan dan dikumpulkan**!

Good luck! 🚀
