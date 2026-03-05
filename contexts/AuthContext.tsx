'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in on mount
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);

    // Redirect to landing page if not logged in and not on auth pages
    if (!userData && pathname !== '/signup' && pathname !== '/login' && pathname !== '/') {
      router.replace('/');
    }
  }, [pathname, router]);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    // Force full page reload to update navbar
    if (userData.role === 'admin') {
      window.location.href = '/admin/home';
    } else {
      window.location.href = '/home';
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
