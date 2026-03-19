import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.successBox}>
        <Text style={styles.successIcon}>✓</Text>

        <Text style={styles.successTitle}>Đặt hàng thành công!</Text>

        <Text style={styles.successMessage}>
          Cảm ơn bạn đã mua sắm. Đơn hàng sẽ được giao đến bạn sớm nhất.
        </Text>

        <Text style={styles.orderInfo}>
          Bạn sẽ nhận được email xác nhận cùng với thông tin theo dõi chi tiết.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.continueBtnText}>Tiếp tục mua sắm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ordersBtn}
          onPress={() => router.push('/orders')}
        >
          <Text style={styles.ordersBtnText}>Xem đơn hàng của tôi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff', // FIX CỨNG TRẮNG
  },

  successBox: {
    alignItems: 'center',
    marginBottom: 40,
  },

  successIcon: {
    fontSize: 80,
    color: '#4caf50',
    marginBottom: 16,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },

  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },

  orderInfo: {
    fontSize: 13,
    textAlign: 'center',
    color: '#555',
    fontStyle: 'italic',
  },

  actions: {
    width: '100%',
    gap: 12,
  },

  continueBtn: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  continueBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  ordersBtn: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  ordersBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});