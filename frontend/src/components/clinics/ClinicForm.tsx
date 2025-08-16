'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { DoctorShort } from '@/interfaces/doctor';
import { Clinic, CreateClinicDto } from '@/interfaces/clinic';
import { FormField } from '@/components/common/FormField';
import {
  MultiSelect,
  MultiSelectOption,
} from '@/components/common/MultiSelect';
import { processBackendErrors } from '@/utils/errors/backend-error.util';
import toast from 'react-hot-toast';
import { cleanOptionalFields } from '@/utils/forms/normalize-form-data.util';

interface ClinicFormProps {
  clinic?: Clinic;
  allDoctors: DoctorShort[];
}

export default function ClinicForm({ clinic, allDoctors }: ClinicFormProps) {
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
      name: clinic?.name || '',
      address: clinic?.address || '',
      phone: clinic?.phone || '',
      email: clinic?.email || '',
      doctorIds: clinic?.doctors.map((d) => d.id) || [],
    },
    mode: 'onChange',
  });

  const doctorIds = watch('doctorIds') || [];

  const handleDoctorsChange = (newIds: number[]) => {
    setValue('doctorIds', newIds, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateClinicDto) => {
    try {
      const normalizedData = cleanOptionalFields(data, ['email']);
      let res;

      if (clinic?.id) {
        res = await fetch(`/api/admin/clinics/${clinic.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalizedData),
        });
      } else {
        res = await fetch(`/api/admin/clinics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalizedData),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        processBackendErrors<CreateClinicDto>(err, setError);
        toast.error('Failed to save clinic. Please try again.');
        return;
      }

      toast.success(
        clinic?.id
          ? 'Clinic updated successfully!'
          : 'Clinic created successfully!',
      );
      router.push('/clinics');
    } catch (err: any) {
      processBackendErrors<CreateClinicDto>(err, setError);
      toast.error('Failed to save clinic. Please try again.');
    }
  };

  const doctorOptions: MultiSelectOption[] = allDoctors.map((doc) => ({
    id: doc.id,
    label: `${doc.lastName ?? ''} ${doc.firstName ?? ''}`.trim(),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {/* === Name === */}
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

      {/* === Address === */}
      <FormField
        label="Address"
        htmlFor="address"
        required
        register={register('address', {
          required: 'Address is required',
        })}
        error={errors.address}
      />

      {/* === Phone === */}
      <FormField
        label="Phone"
        htmlFor="phone"
        required
        register={register('phone', {
          required: 'Phone is required',
          validate: (value) => {
            if (!value) return 'Phone is required';
            if (!/^\+380\d{9}$/.test(value))
              return 'Phone number must be in +380XXXXXXXXX format';
            return true;
          },
        })}
        error={errors.phone}
      />

      {/* === Email === */}
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

      {/* === Doctors === */}
      <MultiSelect
        label="Doctors"
        options={doctorOptions}
        selectedIds={doctorIds}
        onChangeAction={handleDoctorsChange}
        sortFields={['label']}
      />

      {/* === Submit === */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting
          ? 'Saving...'
          : clinic?.id
            ? 'Save Changes'
            : 'Create Clinic'}
      </button>
    </form>
  );
}
