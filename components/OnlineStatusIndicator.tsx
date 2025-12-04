import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatLastSeen } from '../utils/onlineStatus';

interface OnlineStatusIndicatorProps {
  isOnline?: boolean;
  lastSeen?: any;
  size?: 'small' | 'medium';
  showText?: boolean;
}

export default function OnlineStatusIndicator({
  isOnline = false,
  lastSeen,
  size = 'small',
  showText = false,
}: OnlineStatusIndicatorProps) {
  const dotSize = size === 'small' ? 10 : 12;

  if (showText) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.dot,
            { width: dotSize, height: dotSize, borderRadius: dotSize / 2 },
            isOnline ? styles.online : styles.offline,
          ]}
        />
        <Text style={styles.text}>
          {isOnline ? 'Online' : lastSeen ? formatLastSeen(lastSeen) : 'Offline'}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.dot,
        { width: dotSize, height: dotSize, borderRadius: dotSize / 2 },
        isOnline ? styles.online : styles.offline,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  online: {
    backgroundColor: '#34C759',
  },
  offline: {
    backgroundColor: '#8E8E93',
  },
  text: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
});
