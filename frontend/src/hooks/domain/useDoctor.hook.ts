import doctorApi from '@/services/doctorApi';
import clinicApi from '@/services/clinicApi';
import serviceApi from '@/services/serviceApi';
import { Doctor } from '@/interfaces/doctor';
import { Clinic } from '@/interfaces/clinic';
import { Service } from '@/interfaces/service';
import { useEntityFetch } from '@/hooks/core/useEntityFetch.hook';

export function useDoctorHook(doctorId?: number) {
  const {
    mainEntity: doctor,
    extraData,
    loading,
    error,
  } = useEntityFetch<Doctor, { clinics: Clinic[]; services: Service[] }>(
    doctorId ? () => doctorApi.getById(doctorId) : undefined,
    [
      { key: 'clinics', fetchFn: () => clinicApi.getAll() },
      { key: 'services', fetchFn: () => serviceApi.getAll() },
    ],
    [doctorId],
  );

  return {
    doctor,
    clinics: extraData.clinics ?? [],
    services: extraData.services ?? [],
    loading,
    error,
  };
}
