'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Doctor } from '@/interfaces/doctor';
import { CreateClinicDto } from '@/interfaces/clinic';
import clinicApi from '@/services/clinicApi';
import { normalizePhoneFrontend } from '@/utils/phone/normalize-phone.util';
import { FormField } from '@/components/common/FormField';
import {
  MultiSelect,
  MultiSelectOption,
} from '@/components/common/MultiSelect';

interface ClinicFormProps {
  initialValues?: Partial<CreateClinicDto>;
  allDoctors: Pick<Doctor, 'id' | 'firstName' | 'lastName'>[];
  clinicId?: number;
}

export default function ClinicForm({
  initialValues,
  allDoctors,
  clinicId,
}: ClinicFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
  } = useForm<CreateClinicDto>({
    defaultValues: {
      name: initialValues?.name || '',
      address: initialValues?.address || '',
      phone: initialValues?.phone || '',
      email: initialValues?.email || '',
      doctorIds: initialValues?.doctorIds || [],
    },
    mode: 'onChange',
  });

  const doctorIds = watch('doctorIds') || [];

  const handleDoctorsChange = (newIds: number[]) => {
    setValue('doctorIds', newIds, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateClinicDto) => {
    try {
      const normalizedData = {
        ...data,
        phone: normalizePhoneFrontend(data.phone),
      };

      if (!normalizedData.email || normalizedData.email.trim() === '') {
        delete normalizedData.email;
      }

      if (clinicId) {
        await clinicApi.update(clinicId, normalizedData);
        router.push(`/admin/clinics/${clinicId}`);
      } else {
        await clinicApi.create(normalizedData);
        router.push('/clinics');
      }
    } catch (err: any) {
      console.error('Save error:', err.response?.data || err.message);

      const backendMessage = err.response?.data?.message;

      if (typeof backendMessage === 'string') {
        handleBackendError(backendMessage);
      }

      if (Array.isArray(backendMessage)) {
        backendMessage.forEach((msg: string) => handleBackendError(msg));
      }
    }
  };

  const handleBackendError = (msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes('phone')) {
      setError('phone', { message: 'This phone is already in use' });
    }
    if (lower.includes('email')) {
      setError('email', { message: 'This email is already in use' });
    }
    if (lower.includes('name')) {
      setError('name', { message: msg });
    }
    if (lower.includes('address')) {
      setError('address', { message: msg });
    }
  };

  const doctorOptions: MultiSelectOption[] = allDoctors.map((doc) => ({
    id: doc.id,
    label: `${doc.lastName} ${doc.firstName}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {/* Name */}
      <FormField
        label="Name"
        htmlFor="name"
        required
        register={register('name', {
          required: 'Name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
          },
        })}
        error={errors.name}
      />

      {/* Address */}
      <FormField
        label="Address"
        htmlFor="address"
        required
        register={register('address', {
          required: 'Address is required',
        })}
        error={errors.address}
      />

      {/* Phone */}
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
      />

      {/* Email */}
      <FormField
        label="Email"
        htmlFor="email"
        type="email"
        register={register('email', {
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Invalid email address',
          },
        })}
        error={errors.email}
      />

      {/* Doctors */}
      <MultiSelect
        label="Doctors"
        options={doctorOptions}
        selectedIds={doctorIds}
        onChange={handleDoctorsChange}
        sortFields={['label']}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting
          ? 'Saving...'
          : clinicId
            ? 'Save Changes'
            : 'Create Clinic'}
      </button>
    </form>
  );
}
