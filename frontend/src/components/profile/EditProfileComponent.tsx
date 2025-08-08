'use client';

import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormField } from '@/components/common/FormField';
import { User } from '@/interfaces/user/user';
import { useState } from 'react';
import { AxiosError } from 'axios';

interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  phone: string;
}

const phoneValidation = {
  required: 'Phone is required',
  validate: (value: string) =>
    /^\+380\d{9}$/.test(value) ||
    'Phone number must be in +380XXXXXXXXX format',
};

export default function EditProfileComponent({ user }: { user: User | null }) {
  const router = useRouter();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
    mode: 'onChange',
  });

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register('lastName')}
          placeholder="Last Name"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          {...register('firstName')}
          placeholder="First Name"
          className="w-full border p-2 rounded"
        />

        <FormField
          label="Phone"
          htmlFor="phone"
          required
          register={register('phone', phoneValidation)}
          error={errors.phone}
          placeholder="+380XXXXXXXXX"
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
    </div>
  );
}
