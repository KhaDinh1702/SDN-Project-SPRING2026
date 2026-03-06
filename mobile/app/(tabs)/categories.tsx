import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import { Link } from 'expo-router';
import { categoryService } from '../services/categoryService';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => {
        console.log("Categories from backend:", data);
        setCategories(data);
      })
      .catch((err) => console.warn('Failed to load categories:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Category</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <Link href={`/category/${item._id}`} asChild>
            <TouchableOpacity style={styles.card} activeOpacity={0.9}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                />
              ) : (
                <View style={[styles.image, styles.imageFallback]} />
              )}

              <View style={styles.overlay}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },

  card: {
    width: '48%',
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#eee',
  },

  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  imageFallback: {
    backgroundColor: '#c8c8c8',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});