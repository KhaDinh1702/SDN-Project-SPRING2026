import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { authService } from './services/authService';


export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isEmailValid) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    try {
      setLoading(true);

      const message = await authService.forgotPassword(email);

      Alert.alert(
        'Success',
        message || 'Reset instructions sent if email exists',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );

      setEmail('');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Forgot Password</ThemedText>

      <ThemedText style={styles.subtitle}>
        Enter your email to receive reset link
      </ThemedText>

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={[styles.button, { opacity: isEmailValid ? 1 : 0.6 }]}
        onPress={handleSubmit}
        disabled={!isEmailValid || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={{ color: '#fff' }}>
            Send Reset Link
          </ThemedText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/login')}
        style={styles.backBtn}
      >
        <ThemedText>Back to Login</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  subtitle: {
    marginVertical: 10,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff6b35',
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  backBtn: {
    alignItems: 'center',
  },
});