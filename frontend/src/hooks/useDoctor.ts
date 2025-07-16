import { useEffect, useState } from 'react';
import doctorApi from '@/services/doctorApi';
import clinicApi from '@/services/clinicApi';
import serviceApi from '@/services/serviceApi';
import { Doctor } from '@/interfaces/doctor';
import { Clinic } from '@/interfaces/clinic';
import { Service } from '@/interfaces/service';

export function useDoctor(doctorId?: number) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicsData, servicesData] = await Promise.all([
          clinicApi.getAll(),
          serviceApi.getAll(),
        ]);

        setClinics(clinicsData);
        setServices(servicesData);

        if (doctorId) {
          const doctorData = await doctorApi.getById(doctorId);
          setDoctor(doctorData);
        }
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [doctorId]);

  return { doctor, clinics, services, loading, error };
}
