// context/AuthContext.tsx

'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of your user and context
export interface AppUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  phone_verified: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, name: string, phone: string, password: string) => Promise<{ success: boolean; error?: string; tempData?: any }>;
  verifyOTP: (phone: string, otp: string, userData?: any) => Promise<{ success: boolean; error?: string; user?: AppUser; token?: string }>;
  logout: () => void;
}

// Provide the type and a matching default value
const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  verifyOTP: async () => ({ success: false }),
  logout: () => {}
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user data
      fetch('/api/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('authToken');
        }
      })
      .catch(() => {
        localStorage.removeItem('authToken');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signup = async (email: string, name: string, phone: string, password: string) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, phone, password }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, tempData: data.tempData };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const verifyOTP = async (phone: string, otp: string, userData: any) => {
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp, userData }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};