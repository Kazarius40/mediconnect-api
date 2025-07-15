'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Doctor } from '@/interfaces/doctor';
import { CreateClinicDto } from '@/interfaces/clinic';
import clinicService from '@/services/clinic.service';
import { normalizePhoneFrontend } from '@/utils/phone/normalize-phone.util';

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
  } = useForm<CreateClinicDto>({
    defaultValues: {
      name: initialValues?.name || '',
      address: initialValues?.address || '',
      phone: initialValues?.phone || '',
      email: initialValues?.email || '',
      doctorIds: initialValues?.doctorIds || [],
    },
  });

  const doctorIds = watch('doctorIds') || [];

  const addDoctor = (id: number) => {
    if (!doctorIds.includes(id)) {
      setValue('doctorIds', [...doctorIds, id], { shouldValidate: true });
    }
  };

  const removeDoctor = (id: number) => {
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
        await clinicService.update(clinicId, normalizedData);
        router.push(`/admin/clinics/${clinicId}`);
      } else {
        await clinicService.create(normalizedData);
        router.push('/clinics');
      }
    } catch (error: any) {
      console.error('Save error:', error.response?.data || error.message);
    }
  };

  const availableDoctors = allDoctors.filter(
    (doc) => !doctorIds.includes(doc.id),
  );

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
          {...register('name', { required: 'Name is required' })}
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
          {...register('address', { required: 'Address is required' })}
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
              return (
                /^\+380\d{9}$/.test(normalized) || 'Invalid phone number format'
              );
            },
          })}
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
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Doctors */}
      <div>
        <label className="block font-semibold mb-1">Doctors</label>

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
                  {doc.firstName} {doc.lastName}
                </span>
                <button
                  type="button"
                  onClick={() => removeDoctor(id)}
                  className="ml-1 text-blue-600 hover:text-blue-900 font-bold"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

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
          {availableDoctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.firstName} {doc.lastName}
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
