# AppChat - Aplikasi Chat Real-time

Aplikasi chat sederhana menggunakan React Native dan Firebase dengan fitur lengkap:

## ✨ Fitur

- ✅ **Autentikasi dengan Email & Password** (bukan anonymous)
- ✅ **Auto-login** - Menyimpan kredensial untuk login otomatis
- ✅ **Offline Mode** - Chat history tersimpan di local storage
- ✅ **Upload Gambar** - Kirim gambar dalam chat
- ✅ **Real-time Messaging** - Pesan langsung tersinkronisasi
- ✅ **Network Status Indicator** - Menampilkan status online/offline
- ✅ **Modern UI** - Desain yang clean dan responsive

## 📋 Prerequisites

Pastikan sudah terinstall:

- Node.js (>=20)
- Java Development Kit (JDK) 17
- Android SDK
- Android Studio (untuk emulator)
- React Native CLI

## 🚀 Setup Project

### 1. Clone Repository

```bash
git clone https://github.com/daffapandora/AppChat.git
cd AppChat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Buat project baru dengan nama "ChatApp" (atau nama lain)
3. Tambahkan platform **Android**:
   - Package name: `com.appchat`
   - Pastikan sama dengan `android/app/src/main/AndroidManifest.xml`
4. Download file `google-services.json`
5. Masukkan ke folder: `android/app/google-services.json`

### 4. Enable Firebase Services

Di Firebase Console:

#### Authentication
- Buka **Authentication** > **Sign-in method**
- Enable **Email/Password**

#### Firestore Database
- Buka **Firestore Database**
- Create database (Start in **test mode** untuk development)
- Rules (untuk development):
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

#### Storage
- Buka **Storage**
- Get started
- Rules (untuk development):
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

### 5. Update Firebase Config

Buka file `firebase.ts` dan ganti dengan config dari Firebase Console:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. Setup Android Build.gradle

File sudah dikonfigurasi, tapi pastikan:

**`android/build.gradle`:**
```gradle
buildscript {
    dependencies {
        classpath("com.google.gms:google-services:4.4.0")
    }
}
```

**`android/app/build.gradle`:**
```gradle
apply plugin: "com.android.application"
apply plugin: "com.google.gms.google-services"  // Add this line
```

### 7. Setup Android Permissions

File `android/app/src/main/AndroidManifest.xml` sudah include permissions yang dibutuhkan:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

## 🏃 Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
npm run android
```

Atau jika error:
```bash
npx react-native run-android
```

### Run on iOS (Mac only)
```bash
cd ios && pod install && cd ..
npm run ios
```

## 📱 Cara Menggunakan

1. **Register** - Daftar dengan email dan password baru
2. **Login** - Login dengan akun yang sudah dibuat
3. **Auto-login** - Setelah login pertama kali, app akan otomatis login di pembukaan berikutnya
4. **Chat** - Kirim pesan teks
5. **Upload Image** - Klik icon kamera untuk upload gambar
6. **Offline Mode** - Pesan akan tersimpan lokal saat offline dan tersinkronisasi saat online
7. **Logout** - Klik tombol Logout di header untuk keluar

## 🐛 Troubleshooting

### Error: Task ':app:processDebugGoogleServices' failed
- Pastikan file `google-services.json` ada di `android/app/`
- Pastikan package name di Firebase Console sama dengan AndroidManifest.xml

### Error: Unable to resolve module
```bash
npm install
npx react-native start --reset-cache
```

### Error: Image picker not working
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### Build failed di Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## 📚 Teknologi yang Digunakan

- **React Native 0.82** - Framework mobile
- **TypeScript** - Type safety
- **Firebase Authentication** - User authentication
- **Firebase Firestore** - Real-time database
- **Firebase Storage** - Image storage
- **React Navigation** - Navigation
- **AsyncStorage** - Local storage untuk offline mode
- **NetInfo** - Network status monitoring
- **React Native Image Picker** - Image selection

## 📝 Struktur Folder

```
AppChat/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── screens/                 # App screens
│   ├── LoginScreen.tsx      # Login page with auto-login
│   ├── RegisterScreen.tsx   # Registration page
│   └── ChatScreen.tsx       # Chat room with offline mode
├── types/                   # TypeScript types
│   └── navigation.ts        # Navigation types
├── utils/                   # Utility functions
│   └── storage.ts           # AsyncStorage helpers
├── App.tsx                  # Main app component
├── firebase.ts              # Firebase configuration
└── package.json             # Dependencies
```

## 🎯 Fitur Tambahan yang Sudah Diimplementasi

Sesuai tugas:
- ✅ Autentikasi username-password (email-password)
- ✅ Auto-login menggunakan AsyncStorage
- ✅ Offline mode - history chat disimpan di local storage
- ✅ Upload gambar menggunakan Firebase Storage

Fitur bonus:
- ✅ Network status indicator (online/offline)
- ✅ Loading states untuk UX yang lebih baik
- ✅ Error handling yang comprehensive
- ✅ Modern UI dengan design yang clean
- ✅ Image preview sebelum dikirim
- ✅ Unsynced message indicator

## 👨‍💻 Author

**Daffa Pandora**  
Diponegoro University - Informatics

## 📄 License

MIT License
