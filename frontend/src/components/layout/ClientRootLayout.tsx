'use client';

import React from 'react';
import Navbar from './Navbar';
import { AuthProvider } from '@/hooks/useAuth';

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </AuthProvider>
  );
}
