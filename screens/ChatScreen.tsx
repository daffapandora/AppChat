import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from '../firebase';
import { messagesCollection, auth, signOut } from '../firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import {
  saveMessagesToLocal,
  getMessagesFromLocal,
  addMessageToLocal,
  clearUserCredentials,
  saveLastSyncTime,
  StoredMessage,
} from '../utils/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import NetInfo from '@react-native-community/netinfo';

type MessageType = {
  id: string;
  text: string;
  user: string;
  imageBase64?: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  synced?: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const { displayName } = route.params;
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  // Load messages from local storage first (offline-first)
  useEffect(() => {
    const loadLocalMessages = async () => {
      const localMessages = await getMessagesFromLocal();
      if (localMessages.length > 0) {
        setMessages(localMessages);
      }
    };
    loadLocalMessages();
  }, []);

  // Listen to Firestore real-time updates when online
  useEffect(() => {
    if (!isOnline) return;

    const q = query(messagesCollection, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const list: MessageType[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            text: data.text || '',
            user: data.user || '',
            imageBase64: data.imageBase64,
            createdAt: data.createdAt
              ? {
                  seconds: (data.createdAt as Timestamp).seconds,
                  nanoseconds: (data.createdAt as Timestamp).nanoseconds,
                }
              : null,
            synced: true,
          });
        });
        setMessages(list);
        // Save to local storage
        await saveMessagesToLocal(list as StoredMessage[]);
        await saveLastSyncTime();
      },
      (error) => {
        console.error('Error listening to messages:', error);
        Alert.alert('Error', 'Gagal memuat pesan: ' + error.message);
      }
    );

    return () => unsubscribe();
  }, [isOnline]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              await clearUserCredentials();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'Gagal logout');
            }
          },
        },
      ]
    );
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7,
        includeBase64: true, // PENTING: Request base64
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', 'Gagal memilih gambar: ' + response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          
          // Validasi ukuran file (max 1MB untuk base64)
          if (asset.fileSize && asset.fileSize > 1024 * 1024) {
            Alert.alert(
              'Ukuran Terlalu Besar',
              'Ukuran gambar maksimal 1MB. Silakan pilih gambar yang lebih kecil.'
            );
            return;
          }

          if (asset.uri) {
            setSelectedImage(asset.uri);
          } else {
            Alert.alert('Error', 'URI gambar tidak valid');
          }
        }
      }
    );
  };

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      // Untuk React Native, kita perlu fetch image dan convert ke base64
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert to base64'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error: any) {
      console.error('Error converting to base64:', error);
      throw new Error('Gagal memproses gambar: ' + (error.message || 'Unknown error'));
    }
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage && !selectedImage) return;

    let imageBase64: string | undefined = undefined;

    // Convert image to base64 if selected
    if (selectedImage) {
      setProcessing(true);
      try {
        console.log('Converting image to base64...');
        imageBase64 = await convertImageToBase64(selectedImage);
        console.log('Image converted, size:', imageBase64.length, 'characters');
        
        // Validasi ukuran base64 (Firestore max 1MB per field)
        if (imageBase64.length > 1048576) {
          Alert.alert(
            'Gambar Terlalu Besar',
            'Ukuran gambar setelah diproses terlalu besar. Silakan pilih gambar yang lebih kecil.'
          );
          setProcessing(false);
          return;
        }
      } catch (error: any) {
        console.error('Conversion error:', error);
        Alert.alert('Error', error.message || 'Gagal memproses gambar');
        setProcessing(false);
        return;
      }
      setProcessing(false);
      setSelectedImage(null);
    }

    const newMessage: MessageType = {
      id: `temp_${Date.now()}`,
      text: trimmedMessage,
      user: displayName,
      imageBase64,
      createdAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0,
      },
      synced: false,
    };

    // Add to local messages immediately
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    if (isOnline) {
      // Send to Firestore when online
      try {
        const messageData: any = {
          text: trimmedMessage,
          user: displayName,
          createdAt: serverTimestamp(),
        };
        
        // Only add imageBase64 if it exists
        if (imageBase64) {
          messageData.imageBase64 = imageBase64;
        }
        
        await addDoc(messagesCollection, messageData);
        console.log('Message sent to Firestore');
      } catch (error: any) {
        console.error('Error sending message:', error);
        
        // Cek jika error karena ukuran document terlalu besar
        if (error.code === 'invalid-argument' || error.message?.includes('size')) {
          Alert.alert(
            'Error',
            'Gambar terlalu besar untuk disimpan. Firestore membatasi ukuran document maksimal 1MB.'
          );
        } else {
          Alert.alert('Error', 'Gagal mengirim pesan: ' + (error.message || 'Unknown error'));
        }
      }
    } else {
      // Save to local storage when offline
      await addMessageToLocal(newMessage as StoredMessage);
      Alert.alert(
        'Mode Offline',
        'Pesan disimpan secara lokal. Akan dikirim saat online.'
      );
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: MessageType }) => {
      const isMyMessage = item.user === displayName;
      const time = item.createdAt 
        ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : '';
      
      return (
        <View
          style={[
            styles.msgContainer,
            isMyMessage ? styles.myMsgContainer : styles.otherMsgContainer,
          ]}>
          <View
            style={[
              styles.msgBox,
              isMyMessage ? styles.myMsg : styles.otherMsg,
            ]}>
            {!isMyMessage && (
              <Text style={styles.sender}>{item.user}</Text>
            )}
            {item.imageBase64 && (
              <Image 
                source={{ uri: item.imageBase64 }} 
                style={styles.image}
                resizeMode="cover"
                onError={(error) => {
                  console.error('Error loading image:', error.nativeEvent.error);
                }}
              />
            )}
            {item.text ? (
              <Text style={[styles.msgText, isMyMessage && styles.myMsgText]}>
                {item.text}
              </Text>
            ) : null}
            <View style={styles.msgFooter}>
              <Text style={[styles.timeText, isMyMessage && styles.myTimeText]}>
                {time}
              </Text>
              {item.synced === false && (
                <Text style={styles.unsyncedText}>⏱</Text>
              )}
            </View>
          </View>
        </View>
      );
    },
    [displayName]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={0}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>💬</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Chat Room</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, isOnline ? styles.online : styles.offline]} />
                <Text style={styles.headerSubtitle}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          inverted={false}
        />

      {/* Selected Image Preview */}
      {selectedImage && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={styles.removeImageButton}>
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Row */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={pickImage}
          style={styles.imageButton}
          disabled={processing}>
          <Text style={styles.imageButtonText}>📷</Text>
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ketik pesan..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            editable={!processing}
            multiline
            maxLength={1000}
          />
        </View>
        <TouchableOpacity
          onPress={sendMessage}
          style={[
            styles.sendButton, 
            (!message.trim() && !selectedImage) && styles.sendButtonDisabled
          ]}
          disabled={processing || (!message.trim() && !selectedImage)}>
          {processing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {processing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#075E54" />
          <Text style={styles.processingText}>Memproses gambar...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#075E54',
  },
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#075E54',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  online: {
    backgroundColor: '#25D366',
  },
  offline: {
    backgroundColor: '#ff4444',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  msgContainer: {
    marginVertical: 4,
  },
  myMsgContainer: {
    alignItems: 'flex-end',
  },
  otherMsgContainer: {
    alignItems: 'flex-start',
  },
  msgBox: {
    padding: 10,
    paddingBottom: 6,
    borderRadius: 16,
    maxWidth: SCREEN_WIDTH * 0.75,
    minWidth: 80,
  },
  myMsg: {
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 4,
  },
  otherMsg: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sender: {
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 13,
    color: '#075E54',
  },
  msgText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#303030',
  },
  myMsgText: {
    color: '#303030',
  },
  msgFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#999',
  },
  myTimeText: {
    color: '#7C9A7E',
  },
  unsyncedText: {
    fontSize: 11,
    color: '#999',
    marginLeft: 4,
  },
  image: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_WIDTH * 0.55,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#ECE5DD',
    alignItems: 'flex-end',
  },
  imageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageButtonText: {
    fontSize: 22,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 8,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#303030',
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  imagePreview: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    left: 64,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 12,
    color: '#075E54',
    fontSize: 16,
    fontWeight: '500',
  },
});