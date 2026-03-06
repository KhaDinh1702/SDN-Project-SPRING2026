import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = async () => {
    if (!isFormValid) {
      setError('Please enter valid email and password (min 6 characters)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data); // 👈 debug

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // 🔥 QUAN TRỌNG: dùng accessToken chứ không phải token
      if (!data.accessToken) {
        throw new Error("Access token not returned from server");
      }

      // Normalize: backend trả về "id" nhưng mobile dùng "_id"
      const userData = {
        ...data.user,
        _id: data.user._id || data.user.id,
      };

      await login(userData, data.accessToken);

      setSuccess('Login successful 🎉');

      setTimeout(() => {
        router.replace('/');
      }, 800);

    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>
            Sign in to continue shopping fresh
          </Text>

          {/* 🔥 ERROR MESSAGE */}
          {error !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* 🔥 SUCCESS MESSAGE */}
          {success !== '' && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}

          {/* EMAIL */}
          <View
            style={[
              styles.inputGroup,
              email !== '' && !isEmailValid && styles.inputError,
            ]}
          >
            <Ionicons name="mail-outline" size={20} color="#999" />
            <TextInput
              placeholder="Email Address"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          {/* PASSWORD */}
          <View
            style={[
              styles.inputGroup,
              password !== '' && !isPasswordValid && styles.inputError,
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#999" />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid || loading) && styles.disabledBtn,
            ]}
            disabled={!isFormValid || loading}
            onPress={handleLogin}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* REGISTER */}
          <View style={styles.footer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push('/register')}
            >
              <Text style={styles.registerText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 26,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },

  subtitle: {
    color: '#666',
    marginBottom: 20,
  },

  errorBox: {
    backgroundColor: '#ffe5e5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },

  errorText: {
    color: '#d32f2f',
    fontWeight: '500',
  },

  successBox: {
    backgroundColor: '#e6f9ed',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },

  successText: {
    color: '#2e7d32',
    fontWeight: '500',
  },

  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  inputError: {
    borderColor: '#ff4d4f',
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 8,
    fontSize: 15,
  },

  button: {
    backgroundColor: '#ff6b35',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#ff6b35',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 4,
  },

  disabledBtn: {
    backgroundColor: '#ccc',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  registerText: {
    fontWeight: '600',
    color: '#ff6b35',
  },
});