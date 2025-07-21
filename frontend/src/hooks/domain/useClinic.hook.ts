import clinicApi from '@/services/clinicApi';
import doctorApi from '@/services/doctorApi';
import { Clinic } from '@/interfaces/clinic';
import { Doctor } from '@/interfaces/doctor';
import { useEntityFetch } from '@/hooks/core/useEntityFetch.hook';

export function useClinicHook(clinicId?: number) {
  const {
    mainEntity: clinic,
    extraData,
    loading,
    error,
  } = useEntityFetch<Clinic, { doctors: Doctor[] }>(
    clinicId ? () => clinicApi.getById(clinicId) : undefined,
    [{ key: 'doctors', fetchFn: () => doctorApi.getAll() }],
    [clinicId],
  );

  return {
    clinic,
    doctors: extraData.doctors ?? [],
    loading,
    error,
  };
}
