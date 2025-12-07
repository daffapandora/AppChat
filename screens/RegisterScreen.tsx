import React, { useState } from 'react';
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
import { auth, createUserWithEmailAndPassword } from '../firebase';
import { saveUserCredentials } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !displayName.trim()
    ) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan konfirmasi password tidak sama!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter!');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      // Save credentials for auto-login
      await saveUserCredentials({
        email: email.trim(),
        password: password.trim(),
        displayName: displayName.trim(),
      });
      Alert.alert('Sukses', 'Registrasi berhasil! Silakan login.', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Chat', { displayName: displayName.trim() }),
        },
      ]);
    } catch (error: any) {
      let errorMessage = 'Terjadi kesalahan saat registrasi';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah terdaftar!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid!';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password terlalu lemah!';
      }
      Alert.alert('Registrasi Gagal', errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              <Text style={styles.logoEmoji}>✨</Text>
            </View>
            <Text style={styles.title}>Buat Akun Baru</Text>
            <Text style={styles.subtitle}>Daftar untuk mulai chat</Text>
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

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimal 6 karakter"
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
              <Text style={styles.inputLabel}>Konfirmasi Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Ulangi password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
                textContentType="none"
                autoComplete="off"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Daftar</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>Sudah punya akun?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={loading}>
              <Text style={styles.linkText}>Masuk di sini</Text>
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
  headerSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  formSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 18,
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
    marginTop: 8,
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
    paddingTop: 24,
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
