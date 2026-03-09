'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, logoutSuccess } from '@/store/slices/authSlice';

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
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const reduxIsAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sync localStorage with Redux on mount (fallback for migration)
    const userData = localStorage.getItem('user');
    
    if (userData && !reduxUser) {
      // Migrate from localStorage to Redux
      const parsedUser = JSON.parse(userData);
      dispatch(setUser(parsedUser));
    } else if (!userData && reduxUser) {
      // Sync Redux to localStorage
      localStorage.setItem('user', JSON.stringify(reduxUser));
    }
    
    setLoading(false);

    // Redirect to landing page if not logged in and not on auth pages
    const publicPaths = ['/signup', '/login', '/', '/users', '/home'];
    const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith('/events');
    
    if (!reduxIsAuthenticated && !isPublicPath) {
      router.replace('/');
    }
  }, [pathname, router, reduxUser, reduxIsAuthenticated, dispatch]);

  const login = (userData: User) => {
    // Update both localStorage and Redux
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch(setUser(userData));
    
    // Navigate based on role
    if (userData.role === 'admin') {
      router.push('/admin/home');
    } else {
      router.push('/home');
    }
  };

  const logout = () => {
    // Clear both localStorage and Redux
    localStorage.removeItem('user');
    dispatch(logoutSuccess());
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user: reduxUser, login, logout, loading }}>
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
