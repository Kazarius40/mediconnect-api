import '@/app/globals.css';
import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import { AuthProvider } from '@/providers/AuthProvider';
import { SWRProvider } from '@/providers/SWRProvider';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js App with SSR auth',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, accessToken } = await ssrFetchUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider user={user} accessToken={accessToken}>
          <SWRProvider>
            <Navbar />
            <main className="flex-grow container mx-auto p-4">{children}</main>
          </SWRProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
