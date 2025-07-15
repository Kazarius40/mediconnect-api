'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Doctor } from '@/interfaces/doctor';
import { CreateClinicDto } from '@/interfaces/clinic';
import clinicApi from '@/services/clinicApi';
import {
  handlePhoneKeyDown,
  normalizePhoneFrontend,
} from '@/utils/phone/normalize-phone.util';
import { sortByFields } from '@/utils/common/sort.util';

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
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
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

  const addDoctor = (id: number) => {
    if (!doctorIds.includes(id)) {
      setValue('doctorIds', [...doctorIds, id], { shouldValidate: true });
    }
  };

  const deleteDoctor = (id: number) => {
    setValue(
      'doctorIds',
      doctorIds.filter((dId) => dId !== id),
      { shouldValidate: true },
    );
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

  const availableDoctors = allDoctors.filter(
    (doc) => !doctorIds.includes(doc.id),
  );

  const sortedDoctors = sortByFields(
    availableDoctors,
    ['lastName', 'firstName'],
    sortDir,
  );

  const toggleSortDir = () => {
    setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {/* Name */}
      <div>
        <label className="block font-semibold mb-1" htmlFor="name">
          Name *
        </label>
        <input
          id="name"
          className="w-full border p-2 rounded"
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block font-semibold mb-1" htmlFor="address">
          Address *
        </label>
        <input
          id="address"
          className="w-full border p-2 rounded"
          {...register('address', {
            required: 'Address is required',
          })}
          onChange={() => clearErrors('address')}
        />
        {errors.address && (
          <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block font-semibold mb-1" htmlFor="phone">
          Phone *
        </label>
        <input
          id="phone"
          className="w-full border p-2 rounded"
          {...register('phone', {
            required: 'Phone is required',
            validate: (value) => {
              const normalized = normalizePhoneFrontend(value);
              if (!normalized) return 'Invalid phone format';
              if (!/^\+380\d{9}$/.test(normalized))
                return 'Phone number must be in +380XXXXXXXXX format';
              return true;
            },
          })}
          onChange={() => clearErrors('phone')}
          onKeyDown={handlePhoneKeyDown}
        />
        {errors.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block font-semibold mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full border p-2 rounded"
          {...register('email', {
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email address',
            },
          })}
          onChange={() => clearErrors('email')}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Doctors */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block font-semibold">Doctors</label>
          <button
            type="button"
            onClick={toggleSortDir}
            className="text-sm text-blue-600 hover:underline"
          >
            Sort {sortDir === 'asc' ? '↓' : '↑'}
          </button>
        </div>

        {/* Selected doctors */}
        <div className="flex flex-wrap gap-2 mb-2">
          {doctorIds.map((id) => {
            const doc = allDoctors.find((d) => d.id === id);
            if (!doc) return null;
            return (
              <div
                key={id}
                className="flex items-center bg-blue-200 text-blue-800 px-2 py-1 rounded"
              >
                <span>
                  {doc.lastName} {doc.firstName}
                </span>
                <button
                  type="button"
                  onClick={() => deleteDoctor(id)}
                  className="ml-1 text-blue-600 hover:text-blue-900 font-bold"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Dropdown of available doctors */}
        <select
          className="w-full border p-2 rounded"
          onChange={(e) => {
            const id = Number(e.target.value);
            if (id) addDoctor(id);
            e.target.value = '';
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Select a doctor to add
          </option>
          {sortedDoctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.lastName} {doc.firstName}
            </option>
          ))}
        </select>
      </div>

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
