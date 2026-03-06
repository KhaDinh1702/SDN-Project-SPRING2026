import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.successBox}>
        <Text style={styles.successIcon}>✓</Text>

        <Text style={styles.successTitle}>Order Placed!</Text>

        <Text style={styles.successMessage}>
          Thank you for your order. Your items will be delivered soon.
        </Text>

        <Text style={styles.orderInfo}>
          You will receive a confirmation email shortly with tracking details.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ordersBtn}
          onPress={() => router.push('/')}
        >
          <Text style={styles.ordersBtnText}>View My Orders</Text>
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