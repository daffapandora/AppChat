import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { getAuth } from 'firebase/auth';
import { updateOnlineStatus, setupPresence, cleanupPresence } from '../utils/onlineStatus';

/**
 * Hook to track app state and update online status accordingly
 */
export const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const auth = getAuth();

  useEffect(() => {
    // Set online when component mounts
    if (auth.currentUser) {
      setupPresence(auth.currentUser.uid);
    }

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Cleanup on unmount
    return () => {
      subscription.remove();
      if (auth.currentUser) {
        cleanupPresence(auth.currentUser.uid);
      }
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (!auth.currentUser) return;

    // App went to background
    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      updateOnlineStatus(auth.currentUser.uid, false);
    }

    // App came to foreground
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      setupPresence(auth.currentUser.uid);
    }

    appState.current = nextAppState;
  };

  return appState.current;
};
