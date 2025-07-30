import React from 'react';
import { EntityHeader } from '@/components/common/EntityHeader';
import ServiceForm from '@/components/services/ServiceForm';
import { getDoctorsFromServer } from '@/lib/api';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { redirect } from 'next/navigation';

export default async function ServiceCreate() {
  const authResult = await ssrFetchUser();
  const user = authResult.user;
  const token = authResult.accessToken;

  if (!user || user.role !== 'ADMIN' || !token) {
    redirect('/');
  }

  const doctors = await getDoctorsFromServer(token);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <EntityHeader
        title="Create Service"
        editPath=""
        backText="Back to Services"
        isAdmin={false}
      />

      <ServiceForm allDoctors={doctors} />
    </div>
  );
}
