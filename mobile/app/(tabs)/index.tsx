import React, { useEffect, useState, useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Link } from 'expo-router';
import Header from '@/components/Header';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { CartContext } from '@/context/CartContext';



export default function HomeScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          categoryService.getAll(),
          productService.getAll(),
        ]);

        setCategories(cats?.slice(0, 5) || []);
        setFeatured(prods?.slice(0, 10) || []);
      } catch (e) {
        console.warn('Load home failed:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>

      {/* ✅ HEADER COMPONENT */}
      <Header title="Home" />

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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>

        <View style={styles.categoryGrid}>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={{ pathname: '/category/[id]', params: { id: c._id } }}
              asChild
            >
              <TouchableOpacity style={styles.categoryItem}>
                {c.image ? (
                  <Image
                    source={{ uri: c.image }}
                    style={styles.categoryImage}
                  />
                ) : (
                  <View style={[styles.categoryImage, styles.categoryImageFallback]} />
                )}
                <Text style={styles.categoryName}>{c.name}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      {/* FEATURED */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>

        <View style={styles.featureGrid}>
          {featured.map((p) => (
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
                    ${p.price?.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity
                style={[
                  styles.addBtn,
                  addedId === p._id && styles.addedBtn,
                ]}
                onPress={() => handleAdd(p)}
              >
                <Text style={styles.addBtnText}>
                  {addedId === p._id ? 'Added ✓' : 'Add to Cart'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
  section: {
    marginHorizontal: 16,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  categoryItem: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  categoryImageFallback: {
    backgroundColor: '#d0d0d0',
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
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