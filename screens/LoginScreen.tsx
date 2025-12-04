import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { auth, signInWithEmailAndPassword } from '../firebase';
import { getUserCredentials, saveUserCredentials } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isAutoLogging, setIsAutoLogging] = useState<boolean>(true);

  useEffect(() => {
    // Auto-login if credentials exist
    const attemptAutoLogin = async () => {
      try {
        const storedUser = await getUserCredentials();
        if (storedUser) {
          setEmail(storedUser.email);
          setPassword(storedUser.password);
          setDisplayName(storedUser.displayName);
          // Auto login
          await signInWithEmailAndPassword(
            auth,
            storedUser.email,
            storedUser.password
          );
          navigation.replace('Chat', { displayName: storedUser.displayName });
        }
      } catch (error: any) {
        console.log('Auto-login failed:', error.message);
      } finally {
        setIsAutoLogging(false);
      }
    };

    attemptAutoLogin();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim() || !displayName.trim()) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      // Save credentials for auto-login
      await saveUserCredentials({
        email: email.trim(),
        password: password.trim(),
        displayName: displayName.trim(),
      });
      navigation.replace('Chat', { displayName: displayName.trim() });
    } catch (error: any) {
      let errorMessage = 'Terjadi kesalahan saat login';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Email tidak terdaftar. Silakan register terlebih dahulu.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Password salah!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid!';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email atau password salah!';
      }
      Alert.alert('Login Gagal', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isAutoLogging) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Chat App</Text>
        <Text style={styles.subtitle}>Login ke akun Anda</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Nama Tampilan"
          value={displayName}
          onChangeText={setDisplayName}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Masuk</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
          disabled={loading}>
          <Text style={styles.linkText}>Belum punya akun? Daftar di sini</Text>
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
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
