'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Doctor } from '@/interfaces/doctor';
import { CreateServiceDto } from '@/interfaces/service';
import {
  MultiSelect,
  MultiSelectOption,
} from '@/components/common/MultiSelect';
import { processBackendErrors } from '@/utils/errors/backend-error.util';
import toast from 'react-hot-toast';
import { FieldsGroup } from '@/components/common/FieldsGroup';

interface ServiceFormProps {
  initialValues?: Partial<CreateServiceDto>;
  allDoctors: Pick<Doctor, 'id' | 'firstName' | 'lastName'>[];
  serviceId?: number;
}

export default function ServiceForm({
  initialValues,
  allDoctors,
  serviceId,
}: ServiceFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
  } = useForm<CreateServiceDto>({
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      doctorIds: initialValues?.doctorIds || [],
    },
    mode: 'onChange',
  });

  const doctorIds = watch('doctorIds') || [];

  const handleDoctorsChange = (newIds: number[]) => {
    setValue('doctorIds', newIds, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateServiceDto) => {
    try {
      const res = serviceId
        ? await fetch(`/api/admin/services/${serviceId}`, {
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
        serviceId
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <FieldsGroup<CreateServiceDto>
        fields={['name', 'description']}
        registerAction={register}
        errors={errors}
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
          : serviceId
            ? 'Save Changes'
            : 'Create Service'}
      </button>
    </form>
  );
}
