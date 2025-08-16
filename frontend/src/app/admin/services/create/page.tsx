'use server';

import React from 'react';
import { EntityHeader } from '@/components/common/EntityHeader';
import ServiceForm from '@/components/services/ServiceForm';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { redirect } from 'next/navigation';
import { FRONTEND_URL } from '@/config/frontend';
import { Doctor } from '@/interfaces/doctor';

export default async function ServiceCreate() {
  const authResult = await ssrFetchUser();
  const user = authResult.user;

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const res = await fetch(`${FRONTEND_URL}/api/doctors`, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch services', await res.text());
    redirect('/services');
  }

  const {
    doctors,
  }: { doctors: Pick<Doctor, 'id' | 'firstName' | 'lastName'>[] } =
    await res.json();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <EntityHeader
        title="Create Service"
        editPath=""
        backText="Back to Services"
        showControls={false}
      />

      <ServiceForm allDoctors={doctors} />
    </div>
  );
}
