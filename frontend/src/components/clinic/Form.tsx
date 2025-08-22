'use client';

import './style.css';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { DoctorShort } from '@/interfaces/doctor';
import { Clinic, CreateClinicDto } from '@/interfaces/clinic';
import {
  MultiSelect,
  MultiSelectOption,
} from '@/components/common/MultiSelect';
import { processBackendErrors } from '@/utils/errors/backend-error.util';
import toast from 'react-hot-toast';
import { cleanOptionalFields } from '@/utils/forms/normalize-form-data.util';
import { FieldsGroup } from '@/components/common/FieldsGroup';

interface ClinicFormProps {
  clinic?: Clinic;
  allDoctors: DoctorShort[];
}

export default function Form({ clinic, allDoctors }: ClinicFormProps) {
  const router = useRouter();
  const methods = useForm<CreateClinicDto>({
    defaultValues: {
      name: clinic?.name || '',
      address: clinic?.address || '',
      phone: clinic?.phone || '',
      email: clinic?.email || '',
      doctorIds: clinic?.doctors.map((d) => d.id) || [],
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
  const handleDoctorsChange = (newIds: number[]) =>
    setValue('doctorIds', newIds, { shouldValidate: true });

  const onSubmit = async (data: CreateClinicDto) => {
    try {
      const normalizedData = cleanOptionalFields(data, ['email']);
      const res = clinic?.id
        ? await fetch(`/api/admin/clinics/${clinic.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(normalizedData),
          })
        : await fetch(`/api/admin/clinics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(normalizedData),
          });

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

  const doctorOptions: MultiSelectOption[] = allDoctors.map((d) => ({
    id: d.id,
    label: `${d.lastName ?? ''} ${d.firstName ?? ''}`.trim(),
  }));

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="clinic-form">
        <FieldsGroup
          fields={['name', 'address', 'phone', 'email']}
          requiredFields={['name', 'address', 'phone']}
        />
        <MultiSelect
          label="Doctors"
          options={doctorOptions}
          selectedIds={doctorIds}
          onChangeAction={handleDoctorsChange}
          sortFields={['label']}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary ${isSubmitting ? 'btn-disabled' : ''}`}
        >
          {isSubmitting
            ? 'Saving...'
            : clinic?.id
              ? 'Save Changes'
              : 'Create Clinic'}
        </button>
      </form>
    </FormProvider>
  );
}
