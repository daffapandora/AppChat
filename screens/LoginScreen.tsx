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
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
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
          navigation.replace('UserList');
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
      navigation.replace('UserList');
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
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>💬</Text>
          </View>
          <ActivityIndicator size="large" color="#075E54" style={styles.loader} />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>💬</Text>
            </View>
            <Text style={styles.title}>Selamat Datang</Text>
            <Text style={styles.subtitle}>Masuk untuk melanjutkan chat</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                textContentType="none"
                autoComplete="off"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nama Tampilan</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama tampilan"
                placeholderTextColor="#999"
                value={displayName}
                onChangeText={setDisplayName}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Masuk</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>Belum punya akun?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={loading}>
              <Text style={styles.linkText}>Daftar di sini</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#075E54',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#075E54',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#075E54',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  linkText: {
    fontSize: 15,
    color: '#075E54',
    fontWeight: '600',
    marginLeft: 6,
  },
});
