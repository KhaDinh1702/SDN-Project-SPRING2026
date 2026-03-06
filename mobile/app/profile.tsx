import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.74:5001';

export default function ProfileScreen() {
  const { user, token, logout } = useContext(AuthContext);
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(data.data); // 🔥 QUAN TRỌNG
      } else {
        console.log('API error:', data);
      }
    } catch (err) {
      console.log('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.notLoginText}>You are not logged in</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const displayUser = profile || user;

  const avatarLetter =
    displayUser?.first_name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.headerSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>

        <Text style={styles.name}>
          {displayUser.first_name} {displayUser.last_name}
        </Text>

        <Text style={styles.email}>{displayUser.email}</Text>
      </View>

      <View style={styles.card}>
        <InfoRow label="User ID" value={displayUser.id} />
        <InfoRow label="Phone" value={displayUser.phone || 'Not updated'} />
        <InfoRow label="Username" value={displayUser.username} />
        <InfoRow label="Role" value={displayUser.role} />
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await logout();
          router.replace('/');
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notLoginText: {
    fontSize: 16,
    marginBottom: 20,
  },

  headerSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },

  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 14,
  },

  email: {
    color: '#777',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 18,
    padding: 20,
    elevation: 5,
  },

  infoRow: {
    marginBottom: 16,
  },

  infoLabel: {
    fontSize: 13,
    color: '#888',
  },

  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },

  primaryBtn: {
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },

  btnText: {
    color: '#fff',
    fontWeight: '600',
  },

  logoutBtn: {
    backgroundColor: '#e53935',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 6,
  },

  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});