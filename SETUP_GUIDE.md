# 🚀 Setup Guide - Aplikasi Chat

Panduan lengkap untuk setup dan menjalankan aplikasi chat.

## ✅ Checklist Prerequisites

Sebelum memulai, pastikan sudah install:

- [ ] Node.js versi 20 atau lebih tinggi
- [ ] Java Development Kit (JDK) 17
- [ ] Android Studio (dengan Android SDK)
- [ ] Android SDK Platform 34 (Android 14)
- [ ] React Native CLI: `npm install -g react-native-cli`

### Verifikasi Installation

```bash
node --version  # Harus >= 20
java -version   # Harus >= 17
adb version     # Untuk cek Android SDK
```

## 📝 Step-by-Step Installation

### Step 1: Clone dan Install Dependencies

```bash
# Clone repository
git clone https://github.com/daffapandora/AppChat.git
cd AppChat

# Install dependencies
npm install
```

### Step 2: Setup Firebase Project

#### 2.1 Buat Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Klik "Add project" atau "Tambahkan project"
3. Masukkan nama project: **"ChatApp"** (atau nama lain)
4. Klik Continue dan ikuti langkah selanjutnya
5. Disable Google Analytics (opsional untuk development)
6. Klik "Create project"

#### 2.2 Setup Android App di Firebase

1. Di Firebase Console, klik icon Android (</>) untuk menambah Android app
2. **Android package name**: `com.appchat`
   - ⚠️ **Penting**: Harus sama persis!
3. **App nickname**: ChatApp Android (opsional)
4. Klik "Register app"
5. **Download `google-services.json`**
6. Copy file tersebut ke: `AppChat/android/app/google-services.json`

#### 2.3 Enable Firebase Authentication

1. Di Firebase Console sidebar, klik **"Authentication"**
2. Klik tab **"Sign-in method"**
3. Klik **"Email/Password"**
4. Toggle **Enable** ON
5. Klik **"Save"**

#### 2.4 Setup Firestore Database

1. Di Firebase Console sidebar, klik **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in test mode"** (untuk development)
4. Pilih location (misalnya: `asia-southeast2` untuk Jakarta)
5. Klik **"Enable"**

**Security Rules untuk Development:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 2.5 Setup Firebase Storage

1. Di Firebase Console sidebar, klik **"Storage"**
2. Klik **"Get started"**
3. Pilih **"Start in test mode"**
4. Gunakan location yang sama dengan Firestore
5. Klik **"Done"**

**Security Rules untuk Development:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 2.6 Get Firebase Config

1. Di Firebase Console, klik icon gear ⚙️ > **Project settings**
2. Scroll ke bawah ke bagian **"Your apps"**
3. Pilih app Android yang tadi dibuat
4. Di bagian **"SDK setup and configuration"**, pilih tab **"Config"**
5. Copy nilai dari:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Step 3: Update Firebase Config di Kode

Buka file `firebase.ts` dan replace config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // Ganti dengan API Key dari Firebase
  authDomain: "YOUR_AUTH_DOMAIN",       // Ganti dengan Auth Domain
  projectId: "YOUR_PROJECT_ID",         // Ganti dengan Project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Ganti dengan Storage Bucket
  messagingSenderId: "YOUR_SENDER_ID",  // Ganti dengan Messaging Sender ID
  appId: "YOUR_APP_ID"                  // Ganti dengan App ID
};
```

**Contoh (jangan pakai ini, gunakan config kamu sendiri):**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyABcDEfGh1234567890aBcDeFgHiJkLmNo",
  authDomain: "chatapp-12345.firebaseapp.com",
  projectId: "chatapp-12345",
  storageBucket: "chatapp-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:android:abc123def456"
};
```

### Step 4: Verifikasi File google-services.json

Pastikan file ada di lokasi yang benar:

```bash
# Check file existence
ls android/app/google-services.json

# Jika file tidak ada, download lagi dari Firebase Console
```

### Step 5: Build dan Run

#### 5.1 Start Metro Bundler

Buka terminal pertama:
```bash
npm start
```

#### 5.2 Run Android App

Buka terminal kedua:
```bash
# Pastikan emulator atau device sudah terhubung
adb devices

# Run app
npm run android
```

Atau:
```bash
npx react-native run-android
```

## 🐛 Common Issues & Solutions

### Issue 1: Task ':app:processDebugGoogleServices' failed

**Penyebab:** File `google-services.json` tidak ditemukan atau salah lokasi

**Solusi:**
```bash
# Pastikan file ada
ls android/app/google-services.json

# Jika tidak ada, download dari Firebase Console dan copy ke folder tersebut
```

### Issue 2: Package name mismatch

**Error:** Package name mismatch between google-services.json and AndroidManifest.xml

**Solusi:**
- Cek `android/app/src/main/AndroidManifest.xml`
- Pastikan package name adalah `com.appchat`
- Buat ulang app di Firebase Console dengan package name yang benar

### Issue 3: Metro bundler error

**Solusi:**
```bash
# Clear cache
npx react-native start --reset-cache

# Atau hapus cache manual
rm -rf node_modules
npm install
```

### Issue 4: Gradle build failed

**Solusi:**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue 5: Unable to load script

**Solusi:**
```bash
# Pastikan Metro bundler berjalan di terminal terpisah
npm start

# Kemudian di terminal lain
npm run android
```

### Issue 6: Image picker not working

**Solusi:**
```bash
# Rebuild app
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue 7: Firebase initialization failed

**Penyebab:** Firebase config salah

**Solusi:**
- Double check semua nilai di `firebase.ts`
- Pastikan tidak ada typo
- Pastikan menggunakan config dari project yang benar

## 🧪 Testing the App

### Test 1: Registration
1. Buka app
2. Klik "Belum punya akun? Daftar di sini"
3. Isi:
   - Email: `test@example.com`
   - Nama: `Test User`
   - Password: `test123` (min 6 karakter)
   - Konfirmasi password: `test123`
4. Klik "Daftar"
5. Seharusnya langsung masuk ke chat room

### Test 2: Auto-login
1. Tutup app (swipe dari recent apps)
2. Buka app lagi
3. Seharusnya langsung masuk ke chat room tanpa login

### Test 3: Send Message
1. Di chat room, ketik pesan
2. Klik "Kirim"
3. Pesan muncul di bubble biru (my message)

### Test 4: Upload Image
1. Klik icon kamera 📷
2. Pilih gambar dari galeri
3. Preview muncul di bawah
4. Klik "Kirim"
5. Gambar terkirim ke chat

### Test 5: Offline Mode
1. Matikan WiFi/Data
2. Header berubah jadi "🔴 Offline"
3. Kirim pesan
4. Muncul alert "Mode Offline"
5. Pesan tersimpan dengan label "Belum tersinkronisasi"
6. Nyalakan WiFi/Data
7. Pesan otomatis tersinkronisasi

### Test 6: Logout
1. Klik tombol "Logout" di header
2. Konfirmasi logout
3. Kembali ke halaman login

## 📊 Fitur yang Sudah Diimplementasi

### ✅ Fitur Wajib (dari tugas)
- [x] Autentikasi dengan username-password (email-password)
- [x] Auto-login menggunakan AsyncStorage
- [x] Offline mode - chat history disimpan di local storage
- [x] Upload gambar menggunakan Firebase Storage

### ⭐ Fitur Bonus
- [x] Network status indicator (online/offline)
- [x] Loading states
- [x] Error handling yang comprehensive
- [x] Modern UI design
- [x] Image preview sebelum kirim
- [x] Unsynced message indicator
- [x] Registration page
- [x] Real-time message synchronization

## 📚 Referensi

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker)

## 👤 Support

Jika ada masalah atau pertanyaan:
1. Cek bagian Troubleshooting di atas
2. Baca error message dengan teliti
3. Google error message
4. Tanya di grup/forum

## ✅ Next Steps

Setelah app berhasil berjalan:
1. Test semua fitur (registration, login, chat, upload image, offline mode)
2. Coba dengan 2 user berbeda (bisa pakai 2 device/emulator)
3. Test offline mode dengan matikan koneksi
4. Screenshot fitur-fitur untuk laporan
5. Siap untuk dikumpulkan! 🎉
