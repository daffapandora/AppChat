# 🔐 Firebase Configuration Guide

## ⚠️ IMPORTANT SECURITY NOTICE

**NEVER commit your actual Firebase credentials to GitHub!**

Your previous Firebase config was exposed publicly. Follow these steps to secure it:

## 🚨 Immediate Action Required

### 1. Reset Firebase API Key (CRITICAL!)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `aplikasi-chat-59dab`
3. Click ⚙️ Settings → Project Settings
4. Go to **General** tab
5. Scroll to **Web API Key** section
6. Click **Regenerate Key** or delete the old key and create new

### 2. Update Firebase Security Rules

Your old API key is now public, so update security rules immediately:

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Only authenticated users can read/write
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Only authenticated users can upload/download
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Enable App Check (Recommended)

1. In Firebase Console → **App Check**
2. Register your Android app
3. This adds extra protection layer

---

## 📝 How to Configure Firebase Safely

### Step 1: Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ Settings → Project Settings
4. Scroll to **Your apps** section
5. Click on your Android app
6. Copy the config values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",              // Copy this
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.firebasestorage.app",
  messagingSenderId: "123...",
  appId: "1:123...:web:abc..."
};
```

### Step 2: Update firebase.ts (Locally ONLY)

Edit `firebase.ts` on your laptop:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_NEW_API_KEY_HERE",     // Paste new values
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: NEVER Push firebase.ts with Real Credentials

**Before committing:**

```bash
# Check what will be committed
git status

# If firebase.ts is listed, remove it
git reset firebase.ts

# Or add it to .gitignore (already done)
```

**The .gitignore already includes patterns to protect your config.**

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep Firebase config in `firebase.ts` locally only
- Use environment variables for sensitive data
- Enable Firebase Security Rules
- Enable App Check for production
- Regenerate API keys if exposed
- Use different projects for dev/prod

### ❌ DON'T:
- Never commit actual Firebase credentials to GitHub
- Never share API keys publicly
- Never disable Firebase Security Rules
- Never use the same API key after exposure

---

## 🛡️ What to Do If Credentials Are Exposed

1. **Regenerate API Key** (in Firebase Console)
2. **Update Security Rules** (restrict to authenticated users only)
3. **Enable App Check** (extra security layer)
4. **Rotate all credentials** (get new config)
5. **Update local code** (with new credentials)
6. **Monitor Firebase usage** (check for suspicious activity)

---

## 📱 For Team Members

If you're cloning this repo:

1. Clone the repository
2. Create your own Firebase project
3. Get your own Firebase config
4. Update `firebase.ts` with YOUR config
5. Never commit `firebase.ts` with real values

---

## 🔑 Your Old Exposed Credentials

**These are now PUBLIC and should be DISABLED:**

```
Project: aplikasi-chat-59dab
API Key: AIzaSyCvFi2fXZQJD_d8ByLD76s17Xz8M7SQivI (EXPOSED - REGENERATE!)
Project ID: aplikasi-chat-59dab
```

**Action Required:**
1. Go to Firebase Console
2. Project: aplikasi-chat-59dab
3. Settings → Project Settings
4. Regenerate or delete the exposed API key
5. Create new key
6. Update local firebase.ts

---

## 📚 Resources

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Secure Firebase](https://firebase.google.com/docs/projects/learn-more#config-files-objects)

---

## ✅ Checklist

- [ ] Old API key regenerated/deleted
- [ ] New Firebase config obtained
- [ ] firebase.ts updated locally (not committed)
- [ ] Security Rules enabled (Auth required)
- [ ] App Check enabled (optional but recommended)
- [ ] Tested app with new credentials
