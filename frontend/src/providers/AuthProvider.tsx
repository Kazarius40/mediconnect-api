'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import * as authApi from '@/api/auth';
import { User } from '@/interfaces/user/user';
import { isPublicPath } from '@/utils/routes/publicPaths';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const res = await authApi.getProfile();
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    if (!pathname) return;

    void (async () => {
      setLoading(true);
      try {
        const res = await authApi.getProfile();
        setUser(res.data);
      } catch {
        setUser(null);

        const isPublic = isPublicPath(pathname);

        if (!isPublic && pathname !== '/auth/login') {
          router.replace('/auth/login');
        }
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

export function authProvider() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('authProvider must be used within an AuthProvider');
  }
  return context;
}
