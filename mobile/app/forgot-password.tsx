import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isEmailValid) {
      Alert.alert('Lỗi', 'Vui lòng nhập một email hợp lệ');
      return;
    }

    try {
      setLoading(true);

      const message = await authService.forgotPassword(email);

      Alert.alert(
        'Thành công',
        message || 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email này',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );

      setEmail('');
    } catch (error: any) {
      Alert.alert(
        'Lỗi',
        error?.response?.data?.message ||
        error?.message ||
        'Đã có lỗi xảy ra'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>

      <Text style={styles.subtitle}>
        Nhập email của bạn để nhận liên kết đặt lại
      </Text>

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
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            Gửi liên kết khôi phục
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/login')}
        style={styles.backBtn}
      >
        <Text style={styles.backText}>Quay lại đăng nhập</Text>
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },
  subtitle: {
    marginVertical: 10,
    opacity: 0.7,
    color: '#444',
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
  backText: {
    color: '#ff6b35',
    fontWeight: '600',
  },
});