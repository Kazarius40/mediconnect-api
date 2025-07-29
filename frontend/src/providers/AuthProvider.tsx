'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@/interfaces/user/user';
import { isPublicPath } from '@/utils/routes/publicPaths';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  user: initialUser,
  accessToken: initialAccessToken,
}: {
  children: React.ReactNode;
  user: User | null;
  accessToken: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(initialUser);
  const [accessToken, setAccessToken] = useState<string | null>(
    initialAccessToken,
  );
  const [loading, setLoading] = useState<boolean>(!initialUser);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    async function refreshToken() {
      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          console.log('data      :', data);
          setAccessToken(data.accessToken);
          setUser(data.user);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } catch (error) {
        console.error('Refresh token failed:', error);
        setUser(null);
        setAccessToken(null);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }

    if (!user) {
      void refreshToken();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && !user && !isPublicPath(pathname)) {
      router.replace('/auth/login');
    }
  }, [loading, user, pathname, router]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, accessToken, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
