'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateDoctorDto, Doctor } from '@/interfaces/doctor';
import { ClinicShort } from '@/interfaces/clinic';
import { ServiceShort } from '@/interfaces/service';
import {
  MultiSelect,
  MultiSelectOption,
} from '@/components/common/MultiSelect';
import { processBackendErrors } from '@/utils/errors/backend-error.util';
import toast from 'react-hot-toast';
import { cleanOptionalFields } from '@/utils/forms/normalize-form-data.util';
import { FieldsGroup } from '@/components/common/FieldsGroup';

interface DoctorFormProps {
  doctor?: Doctor;
  allClinics: ClinicShort[];
  allServices: ServiceShort[];
}

export default function DoctorForm({
  doctor,
  allClinics,
  allServices,
}: DoctorFormProps) {
  const router = useRouter();

  const methods = useForm<CreateDoctorDto>({
    defaultValues: {
      firstName: doctor?.firstName || '',
      lastName: doctor?.lastName || '',
      phone: doctor?.phone || '',
      email: doctor?.email || '',
      clinicIds: doctor?.clinics.map((c) => c.id) || [],
      serviceIds: doctor?.services.map((s) => s.id) || [],
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { isSubmitting },
  } = methods;

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

      const res = doctor?.id
        ? await fetch(`/api/admin/doctors/${doctor.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(normalizedData),
          })
        : await fetch(`/api/admin/doctors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(normalizedData),
          });

      if (!res.ok) {
        const err = await res.json();
        processBackendErrors<CreateDoctorDto>(err, setError);
        toast.error('Failed to save doctor. Please try again.');
        return;
      }

      toast.success(
        doctor?.id
          ? 'Doctor updated successfully!'
          : 'Doctor created successfully!',
      );
      router.push('/doctors');
    } catch (err: any) {
      processBackendErrors<CreateDoctorDto>(err, setError);
      toast.error('Failed to save doctor. Please try again.');
    }
  };

  const clinicOptions: MultiSelectOption[] = allClinics.map((c) => ({
    id: c.id,
    label: c.name.trim(),
  }));

  const serviceOptions: MultiSelectOption[] = allServices.map((s) => ({
    id: s.id,
    label: s.name.trim(),
  }));

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <FieldsGroup
          fields={['firstName', 'lastName', 'phone', 'email']}
          requiredFields={['firstName', 'lastName']}
        />

        {/* === Clinics === */}
        <MultiSelect
          label="Clinics"
          options={clinicOptions}
          selectedIds={clinicIds}
          onChangeAction={handleClinicsChange}
          sortFields={['label']}
        />

        {/* === Services === */}
        <MultiSelect
          label="Services"
          options={serviceOptions}
          selectedIds={serviceIds}
          onChangeAction={handleServicesChange}
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
            : doctor?.id
              ? 'Save Changes'
              : 'Create Doctor'}
        </button>
      </form>
    </FormProvider>
  );
}
