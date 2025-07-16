import { useEffect, useState } from 'react';
import serviceApi from '@/services/serviceApi';
import doctorApi from '@/services/doctorApi';
import { Service } from '@/interfaces/service';
import { Doctor } from '@/interfaces/doctor';

export function useService(serviceId?: number) {
  const [service, setService] = useState<Service | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsData = await doctorApi.getAll();
        setDoctors(doctorsData);

        if (serviceId) {
          const serviceData = await serviceApi.getById(serviceId);
          setService(serviceData);
        }
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [serviceId]);

  return { service, doctors, loading, error };
}
