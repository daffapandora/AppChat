# Installation Instructions

This document contains detailed installation steps for AppChat, including setup for new features.

## Prerequisites

Before you begin, ensure you have:

- Node.js >= 20
- npm or yarn
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/environment-setup))
- Android Studio (for Android) or Xcode (for iOS)
- Firebase account

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/daffapandora/AppChat.git
cd AppChat
```

### 2. Install Dependencies

```bash
npm install
```

**Required additional packages for new features:**

If you encounter missing dependencies, install these:

```bash
# For AsyncStorage (Theme persistence, offline data)
npm install @react-native-async-storage/async-storage

# For image picker (if implementing avatar upload)
npm install react-native-image-picker

# For permissions
npm install react-native-permissions
```

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Firebase Configuration

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Add an Android and/or iOS app to your Firebase project

#### Enable Firebase Services

1. **Authentication**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"

2. **Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see FIREBASE_RULES.md)

3. **Realtime Database** (Optional, for better presence detection)
   - Go to Realtime Database
   - Create database
   - Set up rules

#### Download Configuration Files

**For Android:**
1. Download `google-services.json`
2. Place it in `android/app/`

**For iOS:**
1. Download `GoogleService-Info.plist`
2. Place it in `ios/` directory

#### Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

### 5. Firestore Database Structure

Create the following collections:

**users** collection:
```javascript
{
  email: string,
  displayName: string,
  bio: string (optional),
  isOnline: boolean,
  lastSeen: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**messages** collection:
```javascript
{
  text: string,
  senderId: string,
  receiverId: string,
  timestamp: timestamp,
  read: boolean (optional),
  edited: boolean (optional)
}
```

### 6. Run the Application

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Metro Bundler (in separate terminal):**
```bash
npm start
```

## Features Setup

### Online Status Tracking

Online status is automatically tracked when users:
- Log in
- Open the app
- Switch between foreground/background

No additional setup required.

### Dark Mode

Dark mode automatically follows system preferences. Users can override in Profile settings.

### Push Notifications (Coming Soon)

To enable push notifications:

1. Enable Firebase Cloud Messaging in Firebase Console
2. Install notification packages:
   ```bash
   npm install @react-native-firebase/messaging
   npm install @notifee/react-native
   ```
3. Configure platform-specific settings

## Troubleshooting

### Common Issues

**1. Metro Bundler Cache Issues**
```bash
npm start -- --reset-cache
```

**2. Android Build Errors**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**3. iOS Build Errors**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

**4. Firebase Connection Issues**
- Verify `google-services.json` and `GoogleService-Info.plist` are in correct locations
- Check `.env` file has correct Firebase config
- Ensure Firebase services are enabled in console

**5. Missing AsyncStorage**
```bash
npm install @react-native-async-storage/async-storage
cd ios && pod install && cd ..
```

### Getting Help

- Check [Issues](https://github.com/daffapandora/AppChat/issues) for known problems
- Create a new issue with:
  - Error message
  - Steps to reproduce
  - Device/OS information
  - App version

## Development Mode

### Enable Debug Mode

**Android:**
- Shake device or press `Cmd+M` (macOS) / `Ctrl+M` (Windows/Linux)
- Select "Debug"

**iOS:**
- Shake device or press `Cmd+D`
- Select "Debug"

### Hot Reload

- Press `R` twice in terminal running Metro
- Or enable "Fast Refresh" in Debug menu

### Remote Debugging

1. Open Debug menu
2. Select "Debug with Chrome"
3. Open Chrome DevTools at `http://localhost:8081/debugger-ui`

## Next Steps

1. Read [README.md](README.md) for feature overview
2. Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
3. Review [FIREBASE_RULES.md](FIREBASE_RULES.md) for security setup
4. Explore the codebase and start coding!

---

**Note:** Some features like image upload and push notifications are marked as "Coming Soon" and may require additional setup when implemented.
