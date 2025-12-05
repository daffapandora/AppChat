# Setup Firebase Storage untuk Upload Gambar

Panduan lengkap untuk mengaktifkan fitur upload gambar di AppChat.

## Langkah 1: Aktifkan Firebase Storage

### Di Firebase Console:

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project: **aplikasi-chat-59dab**
3. Klik **Build** di menu sebelah kiri
4. Klik **Storage**
5. Jika belum aktif, klik tombol **Get Started**
6. Pilih lokasi server (pilih yang terdekat dengan Indonesia, misalnya: `asia-southeast1`)
7. Klik **Done**

## Langkah 2: Atur Firebase Storage Rules

### Di Firebase Console:

1. Masih di halaman **Storage**
2. Klik tab **Rules** di bagian atas
3. **Hapus semua kode yang ada** di editor
4. **Copy-paste kode berikut**:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    match /images/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    
    match /users/{userId}/profile/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

5. Klik tombol **Publish** di bagian atas
6. Tunggu hingga muncul notifikasi "Rules published successfully"

## Langkah 3: Atur Firestore Database Rules

### Di Firebase Console:

1. Klik **Firestore Database** di menu sebelah kiri
2. Klik tab **Rules**
3. **Copy-paste kode berikut**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Klik tombol **Publish**

## Langkah 4: Test Upload

1. Build dan jalankan aplikasi
2. Login dengan akun test
3. Klik icon kamera di chat
4. Pilih gambar dari galeri
5. Klik **Kirim**
6. Gambar akan diupload dan muncul di chat

## Troubleshooting

### Error: "Permission denied" saat upload

**Solusi:**
- Pastikan sudah mengatur Storage Rules seperti di Langkah 2
- Pastikan user sudah login

### Error: "Storage bucket not configured"

**Solusi:**
- Pastikan Firebase Storage sudah diaktifkan di Langkah 1
- Pastikan `storageBucket` di `firebase.ts` sudah benar

### Gambar tidak muncul

**Solusi:**
- Buka Firebase Console > Storage
- Cek apakah file ada di folder `images/`
- Pastikan Storage Rules mengizinkan `read` untuk user yang login

## Cara Kerja

1. User pilih gambar dari galeri
2. Gambar dikompres (1024x1024, quality 0.8)
3. Upload ke Firebase Storage (folder images/)
4. Dapatkan Download URL
5. Simpan URL ke Firestore
6. Gambar ditampilkan di chat menggunakan URL tersebut

## Struktur Data Firestore

```javascript
{
  text: "Ini pesannya",
  user: "John Doe",
  imageUrl: "https://firebasestorage.googleapis.com/.../images/1234567890_abc123.jpg",
  createdAt: Timestamp
}
```

## Referensi

- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
