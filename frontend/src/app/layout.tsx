import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import { AuthProvider } from '@/providers/AuthProvider';
import { SWRProvider } from '@/providers/SWRProvider';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

import './style.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js App with SSR auth',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await ssrFetchUser();

  return (
    <html lang="en">
      <body className="root-layout">
        <AuthProvider user={user}>
          <SWRProvider>
            <Navbar />
            <main className="root-layout__main">{children}</main>
          </SWRProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
