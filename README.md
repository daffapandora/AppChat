# AppChat 💬

A real-time chat application built with React Native and Firebase, featuring user authentication, real-time messaging, and a modern, responsive UI.

## ✨ Features

- **User Authentication**: Secure login and registration with Firebase Authentication
- **Real-time Messaging**: Instant message delivery using Firebase Firestore
- **Connection Status**: Network connectivity monitoring with @react-native-community/netinfo
- **Modern UI**: Clean and intuitive interface with React Navigation
- **Type-Safe**: Built with TypeScript for better code quality and developer experience

## 🚀 Tech Stack

- **React Native** 0.72.0 - Cross-platform mobile framework
- **Firebase** 11.10.0 - Backend services (Authentication, Firestore)
- **React Navigation** 6.1.0 - Navigation library
- **TypeScript** 5.8.3 - Type safety
- **@react-native-community/netinfo** - Network connectivity monitoring

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js >= 20
- npm or yarn
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/environment-setup))
- Android Studio (for Android) or Xcode (for iOS)
- Firebase account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/daffapandora/AppChat.git
   cd AppChat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure Firebase**
   
   a. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   b. Enable Authentication (Email/Password) and Firestore Database
   
   c. Download configuration files:
      - For Android: Download `google-services.json` and place it in `android/app/`
      - For iOS: Download `GoogleService-Info.plist` and place it in `ios/`
   
   d. Copy `.env.example` to `.env` and fill in your Firebase credentials:
   ```bash
   cp .env.example .env
   ```
   
   e. Update `.env` with your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Set up Firestore Security Rules**

   Go to Firebase Console > Firestore Database > Rules and add:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null;
       }
       match /messages/{messageId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## 🏃 Running the App

### Android
```bash
npm run android
# or
yarn android
```

### iOS
```bash
npm run ios
# or
yarn ios
```

### Development Server
```bash
npm start
# or
yarn start
```

## 📱 Usage

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Chat**: Start sending and receiving real-time messages

## 📁 Project Structure

```
AppChat/
├── android/              # Android native code
├── ios/                  # iOS native code
├── screens/              # React Native screens
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── ChatScreen.tsx
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── __tests__/            # Test files
├── App.tsx               # Root component
├── firebase.ts           # Firebase configuration
└── package.json          # Dependencies
```

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
```

## 🛠️ Development Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🔐 Security Notes

- Never commit `.env` files to version control
- Firebase configuration files (`google-services.json` and `GoogleService-Info.plist`) are gitignored for security
- Always use Firebase Security Rules to protect your data

## 🐛 Known Issues

- Network connectivity warning may appear on first launch (normal behavior)
- iOS simulator may require additional setup for keyboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**daffapandora**
- GitHub: [@daffapandora](https://github.com/daffapandora)

## 🙏 Acknowledgments

- React Native team for the amazing framework
- Firebase for backend services
- React Navigation for seamless navigation

---

**Note**: This project is currently in development. More features are being added regularly.
