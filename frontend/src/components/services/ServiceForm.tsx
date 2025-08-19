'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { DoctorShort } from '@/interfaces/doctor';
import { CreateServiceDto, Service } from '@/interfaces/service';
import {
  MultiSelect,
  MultiSelectOption,
} from '@/components/common/MultiSelect';
import { processBackendErrors } from '@/utils/errors/backend-error.util';
import toast from 'react-hot-toast';
import { FieldsGroup } from '@/components/common/FieldsGroup';

interface ServiceFormProps {
  service?: Service;
  allDoctors: DoctorShort[];
}

export default function ServiceForm({ service, allDoctors }: ServiceFormProps) {
  const router = useRouter();

  const methods = useForm<CreateServiceDto>({
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      doctorIds: service?.doctors.map((d) => d.id) || [],
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

  const doctorIds = watch('doctorIds') || [];

  const handleDoctorsChange = (newIds: number[]) => {
    setValue('doctorIds', newIds, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateServiceDto) => {
    try {
      const res = service?.id
        ? await fetch(`/api/admin/services/${service?.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        : await fetch(`/api/admin/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

      if (!res.ok) {
        const err = await res.json();
        processBackendErrors<CreateServiceDto>(err, setError);
        toast.error('Failed to save service. Please try again.');
        return;
      }

      toast.success(
        service?.id
          ? 'Service updated successfully!'
          : 'Service created successfully!',
      );
      router.push('/services');
    } catch (err: any) {
      processBackendErrors<CreateServiceDto>(err, setError);
      toast.error('Failed to save service. Please try again.');
    }
  };

  const doctorOptions: MultiSelectOption[] = allDoctors.map((doc) => ({
    id: doc.id,
    label: `${doc.lastName} ${doc.firstName}`,
  }));

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <FieldsGroup
          fields={['name', 'description']}
          requiredFields={['name']}
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
            : service?.id
              ? 'Save Changes'
              : 'Create Service'}
        </button>
      </form>
    </FormProvider>
  );
}
