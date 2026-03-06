// app/(tabs)/cart.tsx
import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CartContext } from '@/context/CartContext';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useContext(CartContext);
  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/')}>
          <Text style={styles.shopBtnText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart ({cartItems.length})</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.images?.[0]?.url ? (
              <Image source={{ uri: item.images[0].url }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imageFallback]} />
            )}

            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    item.quantity > 1
                      ? updateQuantity(item._id, -1)
                      : removeFromCart(item._id)
                  }
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyNum}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item._id, 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeFromCart(item._id)}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutBtnText}>Checkout →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    padding: 16,
    paddingBottom: 8,
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  emptyIcon: { fontSize: 60, marginBottom: 12 },

  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },

  shopBtn: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },

  shopBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    alignItems: 'center',
    elevation: 1,
  },

  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },

  imageFallback: { backgroundColor: '#ddd' },

  info: {
    flex: 1,
    paddingHorizontal: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 8,
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  qtyNum: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  removeBtn: {
    padding: 6,
  },

  removeBtnText: {
    fontSize: 16,
    color: '#999',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
  },

  totalLabel: {
    fontSize: 13,
    color: '#888',
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  checkoutBtn: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 10,
  },

  checkoutBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
