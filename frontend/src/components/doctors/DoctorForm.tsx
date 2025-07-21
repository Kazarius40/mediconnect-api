'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { CreateDoctorDto } from '@/interfaces/doctor';
import { Clinic } from '@/interfaces/clinic';
import { Service } from '@/interfaces/service';
import doctorApi from '@/services/doctorApi';
import { FormField } from '@/components/common/FormField';
import {
  MultiSelect,
  MultiSelectOption,
} from '@/components/common/MultiSelect';
import { processBackendErrors } from '@/utils/errors/backend-error.util';
import toast from 'react-hot-toast';
import { cleanOptionalFields } from '@/utils/forms/normalize-form-data.util';

interface DoctorFormProps {
  initialValues?: Partial<CreateDoctorDto>;
  doctorId?: number;
  allClinics: Pick<Clinic, 'id' | 'name'>[];
  allServices: Pick<Service, 'id' | 'name'>[];
}

export default function DoctorForm({
  initialValues,
  doctorId,
  allClinics,
  allServices,
}: DoctorFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
  } = useForm<CreateDoctorDto>({
    defaultValues: {
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      phone: initialValues?.phone || '',
      email: initialValues?.email || '',
      clinicIds: initialValues?.clinicIds || [],
      serviceIds: initialValues?.serviceIds || [],
    },
    mode: 'onChange',
  });

  const clinicIds = watch('clinicIds') || [];
  const serviceIds = watch('serviceIds') || [];

  const handleClinicsChange = (newIds: number[]) => {
    setValue('clinicIds', newIds, { shouldValidate: true });
  };

  const handleServicesChange = (newIds: number[]) => {
    setValue('serviceIds', newIds, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateDoctorDto) => {
    try {
      const normalizedData = cleanOptionalFields(data, ['email']);

      if (doctorId) {
        await doctorApi.update(doctorId, normalizedData);
        toast.success('Doctor updated successfully!');
        router.push(`/admin/doctors/${doctorId}`);
      } else {
        await doctorApi.create(normalizedData);
        toast.success('Doctor created successfully!');
        router.push('/doctors');
      }
    } catch (err: any) {
      processBackendErrors<CreateDoctorDto>(err, setError);
      toast.error('Failed to save doctor. Please try again.');
    }
  };

  const clinicOptions: MultiSelectOption[] = allClinics.map((c) => ({
    id: c.id,
    label: c.name,
  }));

  const serviceOptions: MultiSelectOption[] = allServices.map((s) => ({
    id: s.id,
    label: s.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {/* First name */}
      <FormField
        label="First Name"
        htmlFor="firstName"
        required
        register={register('firstName', {
          required: 'First name is required',
          minLength: {
            value: 2,
            message: 'Must be at least 2 characters',
          },
        })}
        error={errors.firstName}
      />

      {/* Last name */}
      <FormField
        label="Last Name"
        htmlFor="lastName"
        required
        register={register('lastName', {
          required: 'Last name is required',
          minLength: {
            value: 2,
            message: 'Must be at least 2 characters',
          },
        })}
        error={errors.lastName}
      />

      {/* Phone */}
      <FormField
        label="Phone"
        htmlFor="phone"
        register={register('phone', {
          validate: (value) => {
            if (!value) return 'Phone is required';
            if (!/^\+380\d{9}$/.test(value))
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

      {/* Clinics */}
      <MultiSelect
        label="Clinics"
        options={clinicOptions}
        selectedIds={clinicIds}
        onChange={handleClinicsChange}
        sortFields={['label']}
      />

      {/* Services */}
      <MultiSelect
        label="Services"
        options={serviceOptions}
        selectedIds={serviceIds}
        onChange={handleServicesChange}
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
          : doctorId
            ? 'Save Changes'
            : 'Create Doctor'}
      </button>
    </form>
  );
}
