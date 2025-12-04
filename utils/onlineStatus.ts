import { doc, updateDoc, onDisconnect, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getDatabase, ref, onDisconnect as rtdbOnDisconnect, set } from 'firebase/database';

/**
 * Update user's online status in Firestore
 * @param userId - User ID
 * @param isOnline - Online status
 */
export const updateOnlineStatus = async (
  userId: string,
  isOnline: boolean
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isOnline,
      lastSeen: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating online status:', error);
  }
};

/**
 * Setup presence system using Realtime Database for reliable disconnect detection
 * This is more reliable than Firestore for presence
 */
export const setupPresence = async (userId: string): Promise<void> => {
  try {
    // Update Firestore to online
    await updateOnlineStatus(userId, true);

    // For better presence detection, you can use Firebase Realtime Database
    // Uncomment if you have RTDB enabled:
    /*
    const rtdb = getDatabase();
    const userStatusRef = ref(rtdb, `status/${userId}`);
    
    // Set online
    await set(userStatusRef, {
      state: 'online',
      lastChanged: serverTimestamp(),
    });

    // Set offline on disconnect
    await rtdbOnDisconnect(userStatusRef).set({
      state: 'offline',
      lastChanged: serverTimestamp(),
    });
    */
  } catch (error) {
    console.error('Error setting up presence:', error);
  }
};

/**
 * Clean up presence when user logs out
 */
export const cleanupPresence = async (userId: string): Promise<void> => {
  try {
    await updateOnlineStatus(userId, false);
  } catch (error) {
    console.error('Error cleaning up presence:', error);
  }
};

/**
 * Format last seen time
 * @param lastSeen - Timestamp or Date
 * @returns Formatted string
 */
export const formatLastSeen = (lastSeen: any): string => {
  if (!lastSeen) return 'Never';

  const lastSeenDate =
    lastSeen.toDate ? lastSeen.toDate() : new Date(lastSeen);
  const now = new Date();
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return lastSeenDate.toLocaleDateString();
};
