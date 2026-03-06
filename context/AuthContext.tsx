import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// =============================
// USER TYPE
// =============================
export interface User {
  _id: string;
  first_name: string;
  email: string;
  phone: string;
}

// =============================
// CONTEXT TYPE
// =============================
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// =============================
// CREATE CONTEXT
// =============================
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

// =============================
// PROVIDER
// =============================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (err) {
      console.log('Load auth failed', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: User, authToken: string) => {
    if (!authToken) {
      throw new Error("Invalid token");
    }

    try {
      setUser(userData);
      setToken(authToken);

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', authToken);
    } catch (err) {
      console.log("Save auth failed", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);

      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
    } catch (err) {
      console.log("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};