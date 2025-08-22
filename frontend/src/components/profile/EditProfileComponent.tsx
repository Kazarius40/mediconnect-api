'use client';

import { useRouter } from 'next/navigation';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { FieldsGroup } from '@/components/common/FieldsGroup';
import { User } from '@/interfaces/user';

interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  phone: string;
}

export default function EditProfileComponent({ user }: { user: User | null }) {
  const router = useRouter();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const methods = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setError('');
    setSuccess('');

    try {
      await fetch('/api/auth/profile/edit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      setSuccess('Profile updated successfully');
      router.replace('/profile');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Update failed');
    }
  };

  if (!user) {
    return <div className="text-center text-red-600">Unauthorized</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldsGroup
            fields={['lastName', 'firstName', 'phone']}
            requiredFields={['phone']}
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
