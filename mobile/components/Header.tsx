import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const [menuVisible, setMenuVisible] = useState(false);

  // 🔥 Avatar Letter Safe
  const avatarLetter = useMemo(() => {
    if (!user?.first_name) return 'U';
    return user.first_name.charAt(0).toUpperCase();
  }, [user]);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightSection}>
        {!user ? (
          <>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.authText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.authText}>Sign Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.avatarWrapper}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => setMenuVisible((prev) => !prev)}
            >
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </TouchableOpacity>

            {menuVisible && (
              <>
                {/* Overlay đóng menu */}
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={() => setMenuVisible(false)}
                />

                <View style={styles.dropdown}>
  <TouchableOpacity
    style={styles.dropdownItem}
    activeOpacity={0.7}
    onPress={() => {
      setMenuVisible(false);
      router.push('/profile');
    }}
  >
    <Text style={styles.dropdownText}>Profile</Text>
  </TouchableOpacity>

  {/* Divider */}
  <View style={{ height: 1, backgroundColor: '#f2f2f2' }} />

  <TouchableOpacity
    style={styles.dropdownItem}
    activeOpacity={0.7}
    onPress={async () => {
      await logout();
      setMenuVisible(false);
    }}
  >
    <Text style={[styles.dropdownText, { color: '#e53935' }]}>
      Logout
    </Text>
  </TouchableOpacity>
</View>
              </>
            )}
          </View>
        )}

        {/* CART */}
        <TouchableOpacity onPress={() => router.push('/cart')}>
          <View>
            <Text style={{ fontSize: 24 }}>🛒</Text>

            {cartItems?.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartItems.length}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  backgroundColor: '#fff',

  zIndex: 999,
  elevation: 20, // Android
},

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  authText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff6b35',
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

 dropdown: {
  position: 'absolute',
  top: 50,
  right: 0,
  backgroundColor: '#fff',
  borderRadius: 16,
  paddingVertical: 8,
  width: 170,

  // 🔥 Shadow iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 20,

  // 🔥 Android
  elevation: 25,

  // 🔥 Border nhẹ cho sắc nét
  borderWidth: 1,
  borderColor: '#f0f0f0',

  zIndex: 1000,
},

dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 16,
},

  dropdownText: {
    fontSize: 14,
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});