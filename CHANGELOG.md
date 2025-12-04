# Changelog

All notable changes to AppChat will be documented in this file.

## [Unreleased] - 2024-12-05

### Added

#### 📚 Documentation
- **README.md** - Comprehensive project documentation with:
  - Features overview
  - Tech stack details
  - Installation instructions
  - Firebase setup guide
  - Project structure
  - Usage examples
- **FIREBASE_RULES.md** - Complete Firebase Security Rules documentation for Firestore and Storage
- **CONTRIBUTING.md** - Contribution guidelines with code style, testing, and PR templates
- **INSTALLATION.md** - Detailed step-by-step installation guide with troubleshooting
- **CHANGELOG.md** - This file to track all changes

#### 🎨 Features

**User Management**
- **UserListScreen** - New screen to browse and select users to chat with
  - Real-time user list from Firestore
  - Search functionality (by name or email)
  - User avatars with initial letters
  - Online/offline status indicators (coming soon)
  - Navigation to chat
  - Logout functionality

- **ProfileScreen** - User profile management
  - View and edit display name
  - Add/edit bio (max 200 characters)
  - View email (read-only)
  - Avatar placeholder (upload coming soon)
  - Save changes to Firestore
  - Back navigation

**Online Status**
- **OnlineStatusIndicator** component - Visual indicator for user online/offline status
  - Green dot for online
  - Gray dot for offline
  - Optional text display with last seen time
  - Configurable sizes (small/medium)

- **Online Status Utilities** (`utils/onlineStatus.ts`)
  - `updateOnlineStatus()` - Update user status in Firestore
  - `setupPresence()` - Initialize presence tracking
  - `cleanupPresence()` - Clean up on logout
  - `formatLastSeen()` - Format last seen timestamp

- **useAppState Hook** - Automatic online status tracking
  - Tracks app foreground/background state
  - Updates user status automatically
  - Cleans up on unmount

**Dark Mode**
- **ThemeContext** - Complete theme system
  - Light mode colors
  - Dark mode colors
  - System preference detection
  - Manual theme override (light/dark/system)
  - Theme persistence with AsyncStorage
  - `useTheme()` hook for easy access

**UI Components**
- **LoadingOverlay** - Reusable loading indicator
  - Modal overlay with spinner
  - Customizable message
  - Used across multiple screens

- **ErrorMessage** - Error display component
  - Styled error message
  - Optional retry button
  - Consistent error handling

#### 🧪 Testing
- **LoadingOverlay.test.tsx** - Unit tests for LoadingOverlay component
- **ErrorMessage.test.tsx** - Unit tests for ErrorMessage component

### Changed

- **LoginScreen** - Updated to navigate to UserList instead of directly to Chat after login
- **UserListScreen** - Added Profile button in header for easy access to profile settings
- **Navigation Types** - Updated `RootStackParamList` to include:
  - `UserList` screen
  - `Profile` screen
  - Enhanced `Chat` params with `userId`, `userEmail`, `displayName`
- **App.tsx** - Added ProfileScreen to navigation stack

### Fixed

- **.gitignore** - Added rules to exclude log files (`*.log`, `hs_err_pid*.log`)
- Removed `hs_err_pid14000.log` (564KB) from repository

### Project Structure Updates

```
AppChat/
├── components/              # NEW: Reusable components
│   ├── LoadingOverlay.tsx
│   ├── ErrorMessage.tsx
│   └── OnlineStatusIndicator.tsx
├── context/                 # NEW: React Context providers
│   └── ThemeContext.tsx
├── hooks/                   # NEW: Custom hooks
│   └── useAppState.ts
├── screens/
│   ├── LoginScreen.tsx      # UPDATED
│   ├── RegisterScreen.tsx
│   ├── UserListScreen.tsx   # NEW
│   ├── ProfileScreen.tsx    # NEW
│   └── ChatScreen.tsx
├── utils/
│   └── onlineStatus.ts      # NEW
├── __tests__/
│   └── components/          # NEW
│       ├── LoadingOverlay.test.tsx
│       └── ErrorMessage.test.tsx
├── CHANGELOG.md             # NEW
├── CONTRIBUTING.md          # NEW
├── FIREBASE_RULES.md        # NEW
├── INSTALLATION.md          # NEW
└── README.md                # NEW
```

### Coming Soon 🚀

These features are planned but not yet implemented:

1. **Message Status** - Read receipts and delivery status
2. **Push Notifications** - Real-time notifications for new messages
3. **Image/File Sharing** - Send photos and files in chat
4. **Delete/Edit Message** - Message management features
5. **Message Pagination** - Load older messages on scroll
6. **Avatar Upload** - Upload custom profile pictures
7. **Voice Messages** - Record and send voice notes
8. **Typing Indicators** - Show when other user is typing
9. **Message Reactions** - React to messages with emojis
10. **Group Chats** - Create and manage group conversations

### Dependencies Added

New packages that need to be installed:

```bash
npm install @react-native-async-storage/async-storage
```

Optional (for future features):
```bash
npm install react-native-image-picker
npm install react-native-permissions
npm install @react-native-firebase/messaging
```

### Database Schema Updates

**users** collection now includes:
```javascript
{
  email: string,
  displayName: string,
  bio: string,              // NEW
  isOnline: boolean,        // NEW
  lastSeen: timestamp,      // NEW
  createdAt: timestamp,
  updatedAt: timestamp      // NEW
}
```

### Migration Guide

If you have an existing installation:

1. Pull latest changes:
   ```bash
   git pull origin main
   ```

2. Install new dependencies:
   ```bash
   npm install
   ```

3. Update Firebase Security Rules (see FIREBASE_RULES.md)

4. iOS users need to install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

5. Run the app:
   ```bash
   npm run android  # or npm run ios
   ```

---

## [0.0.1] - Initial Release

### Added
- Basic authentication (Login/Register)
- Real-time chat functionality
- Firebase integration
- React Navigation setup
- Basic UI components

---

**Legend:**
- 🎨 Features
- 📚 Documentation
- 🐛 Bug Fixes
- 🧪 Testing
- ⚡ Performance
- 🔒 Security
