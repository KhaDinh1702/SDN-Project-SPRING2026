import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native';
import { CartContext } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

type PaymentMethod = 'COD' | 'VNPay';

export default function CheckoutScreen() {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) return false;
    if (!formData.phone || !formData.address) return false;
    if (!formData.city) return false;
    return true;
  };

  const placeOrder = async () => {
    if (!user?._id) {
      Alert.alert('Lỗi', 'Bạn phải đăng nhập trước khi đặt hàng.');
      return;
    }

    if (!validateForm()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      setLoading(true);

      const shippingAddress =
        `${formData.firstName} ${formData.lastName}\n` +
        `${formData.address}\n` +
        `${formData.city}\n` +
        `Phone: ${formData.phone}`;

      const orderData = {
        user_id: user._id,
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        total_amount: totalPrice,
        clientUrl: Linking.createURL('/cart'),
        items: cartItems.map((item) => ({
          product_id: item._id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };

      const result = await orderService.create(orderData);

      // Nếu là VNPay và có paymentUrl → mở trình duyệt thanh toán
      if (paymentMethod === 'VNPay' && result?.paymentUrl) {
        await WebBrowser.openBrowserAsync(result.paymentUrl);
        return; // Dừng xử lý tại đây, deep link callback sẽ xử lý tiếp
      }

      clearCart();
      router.replace('/order-success');
    } catch (error: any) {
      Alert.alert('Đặt hàng thất bại', error?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Trở lại giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>

        {cartItems.map((item) => (
          <View key={item._id} style={styles.summaryItem}>
            <Text style={styles.summaryItemName}>
              {item.name} x{item.quantity}
            </Text>
            <Text style={styles.summaryItemPrice}>
              {(item.price * item.quantity).toLocaleString()}đ
            </Text>
          </View>
        ))}

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            Tổng cộng: {totalPrice.toLocaleString()}đ
          </Text>
        </View>
      </View>

      {/* Shipping */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>

        <View style={styles.row}>
          <TextInput
            placeholder="Tên *"
            placeholderTextColor="#999"
            value={formData.firstName}
            onChangeText={(v) => handleInputChange('firstName', v)}
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            placeholder="Họ *"
            placeholderTextColor="#999"
            value={formData.lastName}
            onChangeText={(v) => handleInputChange('lastName', v)}
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <TextInput
          placeholder="Số điện thoại *"
          placeholderTextColor="#999"
          value={formData.phone}
          onChangeText={(v) => handleInputChange('phone', v)}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          placeholder="Địa chỉ nhà *"
          placeholderTextColor="#999"
          value={formData.address}
          onChangeText={(v) => handleInputChange('address', v)}
          style={styles.input}
        />

        <TextInput
          placeholder="Thành phố *"
          placeholderTextColor="#999"
          value={formData.city}
          onChangeText={(v) => handleInputChange('city', v)}
          style={styles.input}
        />
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

        <View style={styles.paymentRow}>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'COD' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('COD')}
          >
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'COD' && styles.paymentOptionTextSelected,
              ]}
            >
              💵 COD
            </Text>
            <Text style={styles.paymentOptionSub}>Thanh toán khi nhận hàng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'VNPay' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('VNPay')}
          >
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'VNPay' && styles.paymentOptionTextSelected,
              ]}
            >
              🏦 VNPay
            </Text>
            <Text style={styles.paymentOptionSub}>Thanh toán trực tuyến</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.button, styles.cancelBtn]}
          disabled={loading}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelBtnText}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitBtn, loading && styles.disabled]}
          disabled={loading}
          onPress={placeOrder}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {paymentMethod === 'VNPay' ? 'Thanh toán bằng VNPay' : 'Đặt hàng'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  emptyText: {
    fontSize: 16,
    color: '#000',
  },

  backBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },

  backBtnText: {
    color: '#000',
    fontWeight: '600',
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },

  section: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
  },

  sectionTitle: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  summaryItemName: {
    color: '#000',
    flex: 1,
  },

  summaryItemPrice: {
    fontWeight: '600',
    color: '#000',
  },

  totalSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  row: {
    flexDirection: 'row',
    gap: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000',
  },

  halfInput: {
    flex: 1,
  },

  paymentRow: {
    flexDirection: 'row',
    gap: 12,
  },

  paymentOption: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  paymentOptionSelected: {
    borderColor: '#ff6b35',
    backgroundColor: '#fff5f2',
  },

  paymentOptionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555',
    marginBottom: 4,
  },

  paymentOptionTextSelected: {
    color: '#ff6b35',
  },

  paymentOptionSub: {
    fontSize: 11,
    color: '#999',
  },

  actionSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelBtn: {
    backgroundColor: '#e0e0e0',
  },

  cancelBtnText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },

  submitBtn: {
    backgroundColor: '#ff6b35',
  },

  submitBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  disabled: {
    opacity: 0.6,
  },
});