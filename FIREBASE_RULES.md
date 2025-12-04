# Firebase Security Rules

This document contains the recommended security rules for the AppChat Firebase project.

## Firestore Security Rules

These rules ensure that:
- Users can only read/write data when authenticated
- Users can only access their own user document
- All authenticated users can read other users' profiles (for user list)
- Messages can be read and written by authenticated users

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Allow user to read all users (for user list)
      allow read: if request.auth != null;
      
      // Allow user to write only their own document
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Messages collection
    match /messages/{messageId} {
      // Allow read/write for authenticated users
      // You can add more specific rules based on senderId/receiverId fields
      allow read, write: if request.auth != null;
    }
    
    // Chats collection (if you implement private chat rooms)
    match /chats/{chatId} {
      // Allow read/write for authenticated users who are participants
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

## Firebase Storage Rules (for image/file sharing)

If you implement image/file sharing feature, use these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024 // Max 5MB
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Chat attachments
    match /chats/{chatId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024; // Max 10MB
    }
  }
}
```

## How to Apply These Rules

### Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** > **Rules**
4. Copy and paste the Firestore rules above
5. Click **Publish**
6. Navigate to **Storage** > **Rules** (if using storage)
7. Copy and paste the Storage rules above
8. Click **Publish**

### Using Firebase CLI

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   Select Firestore and Storage when prompted.

4. Edit the generated `firestore.rules` and `storage.rules` files

5. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

## Testing Security Rules

You can test your security rules in the Firebase Console:

1. Go to **Firestore Database** > **Rules** > **Rules playground**
2. Select the operation type (read/write)
3. Enter the document path
4. Set authentication state
5. Click **Run**

## Important Security Considerations

1. **Never use these rules in production without testing:**
   - Test all read/write operations
   - Verify authentication requirements
   - Check data validation

2. **Add data validation:**
   ```javascript
   // Example: Validate message structure
   allow write: if request.auth != null 
                && request.resource.data.keys().hasAll(['text', 'senderId', 'timestamp'])
                && request.resource.data.text is string
                && request.resource.data.text.size() > 0;
   ```

3. **Rate limiting:**
   Consider implementing rate limiting to prevent abuse

4. **Data privacy:**
   - Don't store sensitive information in Firestore without encryption
   - Use Firebase Authentication for user management
   - Implement proper user blocking/reporting features

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules Guide](https://firebase.google.com/docs/storage/security)
