import React, { useEffect, useState, useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ActivityIndicator,
  Text,
  TextInput,
  RefreshControl,
  Animated,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ScaleButton = ({ onPress, children, style }: any) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedTouchableOpacity>
  );
};

import Header from '@/components/Header';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { CartContext } from '@/context/CartContext';



export default function HomeScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addToCart } = useContext(CartContext);

  const loadData = async () => {
    try {
      const [cats, prods] = await Promise.all([
        categoryService.getAll(),
        productService.getAll(),
      ]);

      setCategories(cats || []);
      setFeatured(prods || []);
      setFilteredProducts(prods?.slice(0, 10) || []);
    } catch (e) {
      console.warn('Load home failed:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(featured.slice(0, 10));
    } else {
      const filtered = featured.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, featured]);

  const handleAdd = (p: any) => {
    addToCart({
      _id: p._id,
      name: p.name,
      price: p.price,
      quantity: 1,
      images: p.images,
    });

    setAddedId(p._id);
    setTimeout(() => setAddedId(null), 1200);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      {/* ✅ HEADER COMPONENT */}
      <Header title="Home" />

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search fresh products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* BANNER */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>
          Fresh from Farm to Your Table
        </Text>
        <Text style={styles.bannerSubtitle}>
          Quality food delivered fresh to your door
        </Text>

        <Link href="/categories" asChild>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* CATEGORY */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((c) => (
          <Link
            key={c._id}
            href={{ pathname: '/category/[id]', params: { id: c._id } }}
            asChild
          >
            <TouchableOpacity style={styles.categoryItem} activeOpacity={0.7}>
              {c.image ? (
                <Image
                  source={{ uri: c.image }}
                  style={styles.categoryImage}
                />
              ) : (
                <View style={[styles.categoryImage, styles.categoryImageFallback]} />
              )}
              <Text style={styles.categoryName} numberOfLines={1}>{c.name}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>

      {/* FEATURED */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>

        <View style={styles.featureGrid}>
          {filteredProducts.map((p) => (
            <View key={p._id} style={styles.featureCard}>
              <Link
                href={{ pathname: '/product/[id]', params: { id: p._id } }}
                asChild
              >
                <TouchableOpacity>
                  {p.images?.[0]?.url && (
                    <Image
                      source={{ uri: p.images[0].url }}
                      style={styles.featureImage}
                    />
                  )}

                  <Text style={styles.featureName}>{p.name}</Text>
                  <Text style={styles.featurePrice}>
                    {p.price?.toLocaleString()}đ
                  </Text>
                </TouchableOpacity>
              </Link>

              <ScaleButton
                style={[
                  styles.addBtn,
                  addedId === p._id && styles.addedBtn,
                ]}
                onPress={() => handleAdd(p)}
              >
                <Text style={styles.addBtnText}>
                  {addedId === p._id ? 'Added ✓' : 'Add to Cart'}
                </Text>
              </ScaleButton>
            </View>
          ))}
        </View>
        {filteredProducts.length === 0 && searchQuery !== '' && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No products found for "{searchQuery}"</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    backgroundColor: '#1b5e20',
    padding: 20,
    margin: 16,
    borderRadius: 18,
    marginTop: 0, // adjusted because of search bar
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#888',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: '#e0e0e0',
    marginTop: 6,
  },
  shopButton: {
    marginTop: 14,
    backgroundColor: '#ff6b35',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionHeader: {
    marginHorizontal: 20, // matching header/featured margins
    marginBottom: 8,
    marginTop: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  categoryItem: {
    width: 80,
    alignItems: 'center',
    marginRight: 15,
  },
  categoryImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryImageFallback: {
    backgroundColor: '#d0d0d0',
  },
  categoryName: {
    fontSize: 13,
    textAlign: 'center',
    color: '#444',
    fontWeight: '500',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 5,
  },
  featureImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    marginBottom: 8,
  },
  featureName: {
    fontSize: 14,
    fontWeight: '600',
  },
  featurePrice: {
    marginTop: 4,
    color: '#e53935',
    fontWeight: 'bold',
  },
  addBtn: {
    marginTop: 10,
    backgroundColor: '#0a7ea4',
    paddingVertical: 8,
    borderRadius: 8,
  },
  addedBtn: {
    backgroundColor: '#2e7d32',
  },
  addBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
});
