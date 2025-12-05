# Sistem Upload Gambar dengan Base64 (Tanpa Firebase Storage)

## Cara Kerja

Aplikasi ini menggunakan pendekatan **base64 encoding** untuk menyimpan gambar langsung di Firestore Database, **tanpa menggunakan Firebase Storage**.

### Proses Upload:

1. **User memilih gambar** dari galeri
2. **Gambar dikompres** (max 800x800px, quality 70%)
3. **Convert ke Base64** - Gambar diubah menjadi string text
4. **Simpan di Firestore** - String base64 disimpan di field `imageBase64`
5. **Display** - String base64 digunakan langsung untuk menampilkan gambar

## Struktur Data Firestore

```javascript
// Collection: messages
{
  text: "Ini pesannya",
  user: "John Doe",
  imageBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  createdAt: Timestamp
}
```

## Kelebihan Base64:

✅ **Tidak perlu Firebase Storage** - Hemat konfigurasi dan biaya
✅ **Lebih sederhana** - Hanya butuh Firestore
✅ **Tidak perlu Storage Rules** - Security cukup di Firestore saja
✅ **Offline-friendly** - Base64 bisa disimpan di local storage
✅ **Satu source of truth** - Semua data ada di Firestore

## Kekurangan Base64:

❌ **Ukuran file membesar** - Base64 ~33% lebih besar dari binary
❌ **Limit Firestore** - Max 1MB per document (gambar harus kecil)
❌ **Performance** - Query jadi lebih lambat karena document besar
❌ **Biaya Firestore** - Lebih mahal dari Storage untuk gambar besar
❌ **Bandwidth** - Download/upload data lebih besar

## Batasan Ukuran

### Firestore Limits:
- **Maximum document size:** 1MB
- **Recommended image size:** < 500KB setelah di-encode base64
- **Resolution:** 800x800px sudah cukup untuk chat

### Konfigurasi Saat Ini:

```typescript
{
  mediaType: 'photo',
  maxWidth: 800,      // Max width 800px
  maxHeight: 800,     // Max height 800px
  quality: 0.7,       // Quality 70%
  includeBase64: true // Request base64 dari picker
}
```

### Validasi di Kode:

1. **Sebelum convert:** Max 1MB file size
2. **Setelah convert:** Max 1MB base64 string

Jika gambar terlalu besar, user akan mendapat alert untuk memilih gambar lebih kecil.

## Firebase Rules yang Dibutuhkan

Karena **tidak menggunakan Storage**, Anda hanya perlu **Firestore Rules**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Messages collection
    match /messages/{messageId} {
      // User yang login bisa baca/tulis pesan
      allow read, write: if request.auth != null;
      
      // Optional: Validasi ukuran document
      // allow write: if request.auth != null 
      //              && request.resource.size() < 1048576; // Max 1MB
    }
  }
}
```

## Setup (Yang Perlu Dilakukan)

### 1. Firestore Database Rules

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project **aplikasi-chat-59dab**
3. Klik **Firestore Database**
4. Klik tab **Rules**
5. Copy-paste rules di atas
6. Klik **Publish**

### 2. TIDAK PERLU Setup Storage

❌ **TIDAK PERLU** aktifkan Firebase Storage
❌ **TIDAK PERLU** setup Storage Rules
✅ Cukup Firestore saja!

## Testing

1. Pull perubahan:
```bash
git pull origin main
```

2. Install dependencies:
```bash
npm install
```

3. Run aplikasi:
```bash
npm start
```

4. Test upload:
   - Login ke aplikasi
   - Klik icon 📷
   - Pilih gambar (pilih yang kecil dulu untuk test)
   - Klik Kirim
   - Gambar akan dikonversi ke base64 dan disimpan
   - Gambar muncul di chat

## Troubleshooting

### Error: "Gambar Terlalu Besar"

**Penyebab:** File size > 1MB atau base64 string > 1MB

**Solusi:**
- Pilih gambar yang lebih kecil
- Atau kurangi quality di kode:
  ```typescript
  quality: 0.5  // Dari 0.7 ke 0.5
  ```

### Error: "Invalid argument" atau "document size"

**Penyebab:** Document Firestore melebihi 1MB

**Solusi:**
- Pilih gambar yang lebih kecil
- Compress lebih agresif
- Atau pindah ke Firebase Storage jika perlu gambar besar

### Gambar tidak muncul

**Penyebab:** Base64 string corrupt atau tidak valid

**Solusi:**
- Cek console log untuk error
- Pastikan format base64 benar: `data:image/jpeg;base64,...`
- Cek di Firestore Console apakah field `imageBase64` terisi

### Performance lambat

**Penyebab:** Document terlalu besar, query jadi lambat

**Solusi:**
- Batasi jumlah pesan yang di-load (pagination)
- Compress gambar lebih agresif
- Atau pertimbangkan pindah ke Firebase Storage

## Kapan Harus Pindah ke Storage?

Pertimbangkan menggunakan Firebase Storage jika:

- 📸 User sering kirim gambar beresolusi tinggi
- 📊 Banyak gambar dalam satu chat (>50 gambar)
- 🐌 Performance Firestore mulai lambat
- 💰 Biaya Firestore mulai mahal
- 📹 Butuh support video atau file besar lainnya

## Monitoring

### Cek ukuran document di Firestore:

1. Buka Firebase Console → Firestore
2. Klik collection `messages`
3. Lihat document individual
4. Cek field `imageBase64` - panjang string berapa?

### Average size:
- Text only: ~200 bytes
- Text + small image (800x800, 70%): ~100-300KB
- Text + large image: bisa sampai 900KB

## Best Practices

1. **Inform user** tentang limit ukuran
2. **Validate early** - Cek size sebelum convert
3. **Compress aggressively** - Quality 70% sudah cukup
4. **Monitor costs** - Firestore charge per read/write
5. **Consider pagination** - Jangan load semua pesan sekaligus

## Referensi

- [Firestore Document Limits](https://firebase.google.com/docs/firestore/quotas)
- [Base64 Encoding](https://developer.mozilla.org/en-US/docs/Web/API/btoa)
- [React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker)

## Catatan Penting

⚠️ **Firestore pricing:** 
- Storage: $0.18/GB/month
- Reads: $0.06 per 100,000
- Writes: $0.18 per 100,000

Gambar besar di Firestore bisa lebih mahal daripada Storage!

⚠️ **Performance consideration:**
Document besar membuat query lambat. Untuk production dengan banyak user, pertimbangkan:
- Pagination (load 20 pesan per page)
- Lazy loading images
- Thumbnail system (save small & large version)
- Atau migrate ke Firebase Storage