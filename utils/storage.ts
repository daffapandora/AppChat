import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredMessage {
  id: string;
  text: string;
  user: string;
  imageUrl?: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  synced: boolean;
}

export interface StoredUser {
  email: string;
  password: string;
  displayName: string;
}

// Keys for AsyncStorage
const MESSAGES_KEY = '@messages';
const USER_KEY = '@user';
const LAST_SYNC_KEY = '@last_sync';

// Message storage functions
export const saveMessagesToLocal = async (messages: StoredMessage[]) => {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages to local storage:', error);
  }
};

export const getMessagesFromLocal = async (): Promise<StoredMessage[]> => {
  try {
    const messagesJson = await AsyncStorage.getItem(MESSAGES_KEY);
    return messagesJson ? JSON.parse(messagesJson) : [];
  } catch (error) {
    console.error('Error getting messages from local storage:', error);
    return [];
  }
};

export const addMessageToLocal = async (message: StoredMessage) => {
  try {
    const messages = await getMessagesFromLocal();
    messages.push(message);
    await saveMessagesToLocal(messages);
  } catch (error) {
    console.error('Error adding message to local storage:', error);
  }
};

// User credentials storage for auto-login
export const saveUserCredentials = async (user: StoredUser) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user credentials:', error);
  }
};

export const getUserCredentials = async (): Promise<StoredUser | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user credentials:', error);
    return null;
  }
};

export const clearUserCredentials = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing user credentials:', error);
  }
};

// Last sync timestamp
export const saveLastSyncTime = async () => {
  try {
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error saving last sync time:', error);
  }
};

export const getLastSyncTime = async (): Promise<Date | null> => {
  try {
    const timeString = await AsyncStorage.getItem(LAST_SYNC_KEY);
    return timeString ? new Date(timeString) : null;
  } catch (error) {
    console.error('Error getting last sync time:', error);
    return null;
  }
};

// Clear all data (useful for logout)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([MESSAGES_KEY, USER_KEY, LAST_SYNC_KEY]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
