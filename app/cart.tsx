import React, { useContext } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Text,
} from 'react-native';
import { CartContext } from '@/context/CartContext';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { cartItems, totalPrice, updateQuantity, removeFromCart } =
    useContext(CartContext);
  const router = useRouter();

  const handleLongPress = (id: string, name: string) => {
    Alert.alert(
      'Remove Item',
      `Do you want to remove "${name}" from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(id),
        },
      ]
    );
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>🛒 Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => router.push('/')}
        >
          <Text style={styles.shopBtnText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: '#fff' }}
      data={cartItems}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.95}
          onLongPress={() => handleLongPress(item._id, item.name)}
        >
          <View style={styles.cartItem}>
            {item.images?.[0]?.url && (
              <Image
                source={{ uri: item.images[0].url }}
                style={styles.itemImage}
              />
            )}

            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.itemPrice}>
                ${item.price?.toFixed(2) ?? '0.00'}
              </Text>
            </View>

            <View style={styles.itemControls}>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  onPress={() =>
                    item.quantity > 1 &&
                    updateQuantity(item._id, -1)
                  }
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{item.quantity}</Text>

                <TouchableOpacity
                  onPress={() => updateQuantity(item._id, 1)}
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListHeaderComponent={
        <Text style={styles.title}>
          My Cart ({cartItems.length} items)
        </Text>
      }
      ListFooterComponent={
        <View style={styles.footer}>
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                ${totalPrice?.toFixed(2) ?? '0.00'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>FREE</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                ${totalPrice?.toFixed(2) ?? '0.00'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => router.push('/checkout')}
          >
            <Text style={styles.checkoutBtnText}>
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  emptyText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#000',
  },

  shopBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },

  shopBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  list: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },

  cartItem: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },

  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },

  itemControls: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  qty: {
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '600',
    color: '#000',
  },

  footer: {
    marginTop: 24,
  },

  summarySection: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#000',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  checkoutBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});