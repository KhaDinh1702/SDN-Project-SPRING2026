import React, { useEffect, useState, useContext } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { productService, Product } from '../services/productService';
import { reviewService, Review } from '../services/reviewService';
import { CartContext } from '@/context/CartContext';

const { width } = Dimensions.get('window');

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const [prod, revs] = await Promise.all([
          productService.getById(id as string),
          reviewService.getByProduct(id as string),
        ]);
        setProduct(prod);
        setReviews(revs);
      } catch (e) {
        console.warn('Failed to load product:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.blackText}>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      images: product.images,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE SLIDER */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {product.images?.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img.url }}
              style={styles.mainImage}
            />
          ))}
        </ScrollView>

        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>

          {/* RATING ROW – chỉ hiện khi có đánh giá thực */}
          {avgRating && (
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐ {avgRating}</Text>
              <Text style={styles.reviewCount}>({reviews.length} đánh giá)</Text>
            </View>
          )}

          <Text style={styles.price}>
            ₫ {product.price?.toLocaleString()}
          </Text>

          <View style={styles.stockBox}>
            <Text style={styles.blackText}>
              {product.stock_quantity > 0
                ? `Còn ${product.stock_quantity} sản phẩm`
                : 'Hết hàng'}
            </Text>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* REVIEWS FROM API */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Đánh giá sản phẩm ({reviews.length})
            </Text>

            {reviews.length === 0 ? (
              <Text style={styles.noReview}>Chưa có đánh giá nào.</Text>
            ) : (
              reviews.map((r) => (
                <View key={r._id} style={styles.feedbackItem}>
                  <Text style={styles.feedbackName}>
                    {r.user_id?.first_name} {r.user_id?.last_name}
                  </Text>
                  <Text style={styles.blackText}>
                    {'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </Text>
                  <Text style={styles.feedbackText}>{r.comment}</Text>
                </View>
              ))
            )}
          </View>

          {/* QUANTITY */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Số lượng</Text>

            <View style={styles.quantityControl}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </Pressable>

              <Text style={styles.qtyDisplay}>{quantity}</Text>

              <Pressable
                style={styles.qtyBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartBtnText}>🛒 Thêm vào giỏ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={styles.buyBtnText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  blackText: {
    color: '#000',
  },

  mainImage: {
    width,
    height: 350,
  },

  infoSection: {
    padding: 16,
  },

  productName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },

  ratingRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  rating: {
    marginRight: 8,
    fontWeight: '600',
    color: '#000',
  },

  reviewCount: {
    fontSize: 12,
    color: '#000',
  },

  price: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#000',
  },

  stockBox: {
    paddingVertical: 6,
    marginBottom: 16,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },

  description: {
    lineHeight: 20,
    color: '#000',
  },

  noReview: {
    color: '#999',
    fontStyle: 'italic',
  },

  feedbackItem: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },

  feedbackName: {
    fontWeight: '600',
    color: '#000',
  },

  feedbackText: {
    fontSize: 13,
    color: '#000',
  },

  quantitySection: {
    marginBottom: 20,
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  qtyDisplay: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  bottomBar: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    backgroundColor: '#FFFFFF',
  },

  cartBtn: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#f2f2f2',
  },

  cartBtnText: {
    fontWeight: '600',
    color: '#000',
  },

  buyBtn: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#000',
  },

  buyBtnText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
});