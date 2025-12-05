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
} from 'react-native';
import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from '../firebase';
import { messagesCollection, auth, signOut, storage, ref, uploadBytes, getDownloadURL } from '../firebase';
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
  imageUrl?: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  synced?: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const { displayName } = route.params;
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
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
            imageUrl: data.imageUrl,
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
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
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
          const imageUri = response.assets[0].uri;
          if (imageUri) {
            setSelectedImage(imageUri);
          } else {
            Alert.alert('Error', 'URI gambar tidak valid');
          }
        }
      }
    );
  };

  const uploadImage = async (uri: string): Promise<string> => {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const filename = `images/${timestamp}_${randomString}.jpg`;
      
      console.log('Uploading image to:', filename);
      
      // Create storage reference
      const imageRef = ref(storage, filename);

      // Fetch image and convert to blob
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Gagal mengambil gambar dari URI');
      }
      const blob = await response.blob();
      
      console.log('Image blob size:', blob.size);

      // Upload to Firebase Storage
      const uploadResult = await uploadBytes(imageRef, blob);
      console.log('Upload successful:', uploadResult.metadata.fullPath);

      // Get download URL
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Download URL:', downloadURL);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error('Gagal mengupload gambar: ' + (error.message || 'Unknown error'));
    }
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage && !selectedImage) return;

    let imageUrl: string | undefined = undefined;

    // Upload image if selected
    if (selectedImage) {
      if (!isOnline) {
        Alert.alert(
          'Offline',
          'Upload gambar memerlukan koneksi internet. Pesan teks akan disimpan secara lokal.'
        );
        setSelectedImage(null);
        return;
      }

      setUploading(true);
      try {
        console.log('Starting image upload...');
        imageUrl = await uploadImage(selectedImage);
        console.log('Image uploaded successfully:', imageUrl);
        Alert.alert('Sukses', 'Gambar berhasil diupload!');
      } catch (error: any) {
        console.error('Upload error:', error);
        Alert.alert('Error', error.message || 'Gagal mengupload gambar');
        setUploading(false);
        return;
      }
      setUploading(false);
      setSelectedImage(null);
    }

    const newMessage: MessageType = {
      id: `temp_${Date.now()}`,
      text: trimmedMessage,
      user: displayName,
      imageUrl,
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
        
        // Only add imageUrl if it exists
        if (imageUrl) {
          messageData.imageUrl = imageUrl;
        }
        
        await addDoc(messagesCollection, messageData);
        console.log('Message sent to Firestore');
      } catch (error: any) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Gagal mengirim pesan: ' + (error.message || 'Unknown error'));
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
      return (
        <View
          style={[
            styles.msgBox,
            isMyMessage ? styles.myMsg : styles.otherMsg,
          ]}>
          <Text style={[styles.sender, isMyMessage && styles.mySender]}>
            {item.user}
          </Text>
          {item.imageUrl && (
            <Image 
              source={{ uri: item.imageUrl }} 
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
          {item.synced === false && (
            <Text style={styles.unsyncedText}>⏱ Belum tersinkronisasi</Text>
          )}
        </View>
      );
    },
    [displayName]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Chat Room</Text>
          <Text style={styles.headerSubtitle}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
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
      <View style={styles.inputRow}>
        <TouchableOpacity
          onPress={pickImage}
          style={styles.imageButton}
          disabled={uploading}>
          <Text style={styles.imageButtonText}>📷</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
          editable={!uploading}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendButton, uploading && styles.sendButtonDisabled]}
          disabled={uploading || (!message.trim() && !selectedImage)}>
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Kirim</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesList: {
    padding: 10,
  },
  msgBox: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: '75%',
  },
  myMsg: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  otherMsg: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 12,
    color: '#666',
  },
  mySender: {
    color: '#E0E0E0',
  },
  msgText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#333',
  },
  myMsgText: {
    color: '#fff',
  },
  unsyncedText: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageButton: {
    padding: 10,
    marginRight: 8,
  },
  imageButtonText: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imagePreview: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
