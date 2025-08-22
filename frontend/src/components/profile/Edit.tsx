'use client';

import { useRouter } from 'next/navigation';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { FieldsGroup } from '@/components/common/FieldsGroup';
import { User } from '@/interfaces/user';

import './style.css';

interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  phone: string;
}

export default function Edit({ user }: { user: User | null }) {
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
    return <div className="error-message">Unauthorized</div>;
  }

  return (
    <div className="edit-container">
      <h1 className="edit-title">Edit Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
          <FieldsGroup
            fields={['lastName', 'firstName', 'phone']}
            requiredFields={['phone']}
          />

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
