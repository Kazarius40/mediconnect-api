'use client';

import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/api/axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { normalizePhoneFrontend } from '@/utils/phone/normalize-phone.util';
import { FormField } from '@/components/common/FormField';
import { User } from '@/interfaces/user/user';

interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  phone: string;
}

export default function EditProfilePage() {
  const router = useRouter();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: { firstName: '', lastName: '', phone: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<User>('/auth/profile');
        const profile = res.data;
        setValue('lastName', profile.lastName || '');
        setValue('firstName', profile.firstName || '');
        setValue('phone', profile.phone || '');
      } catch {
        router.push('/auth/login');
      }
    };
    void fetchProfile();
  }, [router, setValue]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setError('');
    setSuccess('');

    try {
      await api.patch('/auth/profile', data);
      setSuccess('Profile updated successfully');
      setTimeout(() => router.push('/profile'), 1000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Update failed');
    }
  };

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
          register={register('phone', {
            required: 'Phone is required',
            validate: (value) => {
              const normalized = normalizePhoneFrontend(value);
              if (!normalized) return 'Invalid phone format';
              if (!/^\+380\d{9}$/.test(normalized))
                return 'Phone number must be in +380XXXXXXXXX format';
              return true;
            },
          })}
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
