import { useEffect, useState } from 'react';
import clinicApi from '@/services/clinicApi';
import doctorApi from '@/services/doctorApi';
import { Clinic } from '@/interfaces/clinic';
import { Doctor } from '@/interfaces/doctor';

export function useClinic(clinicId?: number) {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsData = await doctorApi.getAll();
        setDoctors(doctorsData);

        if (clinicId) {
          const clinicData = await clinicApi.getById(clinicId);
          setClinic(clinicData);
        }
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [clinicId]);

  return { clinic, doctors, loading, error };
}
