import React, { useEffect, useState, useContext } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  TextInput,
  Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { productService } from '../services/productService';
import { CartContext } from '@/context/CartContext';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const loadProducts = async () => {
      try {
        const data = await productService.getAll({ categoryId: id as string });
        setProducts(data);
      } catch (err) {
        console.warn('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: '#fff' }}
      data={filteredProducts}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <TextInput
          placeholder="Search products..."
          placeholderTextColor="#666"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      }
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/product/${item._id}` as any)}
          activeOpacity={0.9}
        >
          {item.images?.[0]?.url && (
            <Image
              source={{ uri: item.images[0].url }}
              style={styles.image}
            />
          )}

          <Text numberOfLines={2} style={styles.productName}>
            {item.name}
          </Text>

          <Text style={styles.price}>
            ${item.price?.toFixed(2)}
          </Text>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  list: {
    padding: 12,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    color: '#000',
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  card: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },

  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },

  productName: {
    fontSize: 13,
    fontWeight: '600',
    padding: 8,
    minHeight: 36,
    color: '#000',
  },

  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 8,
  },

  addBtn: {
    backgroundColor: '#000',
    paddingVertical: 6,
    margin: 8,
    borderRadius: 4,
    alignItems: 'center',
  },

  addBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});