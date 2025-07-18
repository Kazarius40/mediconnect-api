'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthUser } from '@/interfaces/auth';
import * as authApi from '@/api/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/register',
  '/auth/reset-password',
  '/auth/forgot-password',
  '/clinics',
  '/doctors',
  '/services',
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await authApi.getProfile();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + '/'),
    );

    if (isPublic) {
      setLoading(false);
      return;
    }

    void (async () => {
      setLoading(true);
      try {
        const res = await authApi.getProfile();
        setUser(res.data);
      } catch {
        setUser(null);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
