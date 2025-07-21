import serviceApi from '@/services/serviceApi';
import doctorApi from '@/services/doctorApi';
import { Service } from '@/interfaces/service';
import { Doctor } from '@/interfaces/doctor';
import { useEntityFetch } from '@/hooks/core/useEntityFetch.hook';

export function useServiceHook(serviceId?: number) {
  const {
    mainEntity: service,
    extraData,
    loading,
    error,
  } = useEntityFetch<Service, { doctors: Doctor[] }>(
    serviceId ? () => serviceApi.getById(serviceId) : undefined,
    [{ key: 'doctors', fetchFn: () => doctorApi.getAll() }],
    [serviceId],
  );

  return {
    service,
    doctors: extraData.doctors ?? [],
    loading,
    error,
  };
}
