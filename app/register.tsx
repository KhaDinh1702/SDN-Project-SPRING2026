import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

export default function RegisterScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.length >= 6;
  const isConfirmValid = form.password === form.confirmPassword;
  const isPhoneValid = /^[0-9]{9,11}$/.test(form.phone);

  const isFormValid =
    form.first_name &&
    form.last_name &&
    isPhoneValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmValid;

  const handleChange = (key: string, value: string) => {
    setError('');
    setSuccess('');
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (!isFormValid) {
      setError('Please fill all fields correctly');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const baseUsername = form.email.trim().split('@')[0];
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      const username = `${baseUsername}${randomNumber}`;

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Register failed');
        return;
      }

      setSuccess('Account created successfully!');
      setTimeout(() => {
        router.replace('/login');
      }, 1500);

    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join Fresh Market and start shopping fresh
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <TextInput
          placeholder="First Name"
          style={styles.input}
          onChangeText={(v) => handleChange('first_name', v)}
        />

        <TextInput
          placeholder="Last Name"
          style={styles.input}
          onChangeText={(v) => handleChange('last_name', v)}
        />

        <TextInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          style={[
            styles.input,
            form.phone && !isPhoneValid && styles.inputError,
          ]}
          onChangeText={(v) => handleChange('phone', v)}
        />

        <TextInput
          placeholder="Email Address"
          keyboardType="email-address"
          style={[
            styles.input,
            form.email && !isEmailValid && styles.inputError,
          ]}
          onChangeText={(v) => handleChange('email', v)}
        />

        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            onChangeText={(v) => handleChange('password', v)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.passwordBox,
            form.confirmPassword && !isConfirmValid && styles.inputError,
          ]}
        >
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!showConfirm}
            style={styles.passwordInput}
            onChangeText={(v) => handleChange('confirmPassword', v)}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? 'eye' : 'eye-off'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!isFormValid || loading) && styles.disabledBtn,
          ]}
          disabled={!isFormValid || loading}
          onPress={handleRegister}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f4f6f9',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },

  subtitle: {
    color: '#666',
    marginBottom: 25,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  inputError: {
    borderColor: '#e53935',
  },

  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
  },

  button: {
    backgroundColor: '#ff6b35',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ff6b35',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  disabledBtn: {
    backgroundColor: '#ccc',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  loginLink: {
    fontWeight: '600',
    color: '#ff6b35',
  },

  errorText: {
    backgroundColor: '#ffe5e5',
    color: '#e53935',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  successText: {
    backgroundColor: '#e6f9f0',
    color: '#00a86b',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
});