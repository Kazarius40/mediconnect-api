import { Clinic, CreateClinicDto, UpdateClinicDto } from '@/interfaces/clinic';
import api from '@/api/axios';

const clinicApi = {
  async getAll(): Promise<Clinic[]> {
    const res = await api.get<Clinic[]>('/clinics');
    return res.data;
  },

  async getById(id: number): Promise<Clinic> {
    const res = await api.get<Clinic>(`/clinics/${id}`);
    return res.data;
  },

  async create(data: CreateClinicDto): Promise<Clinic> {
    const res = await api.post<Clinic>('/clinics', data);
    return res.data;
  },

  async update(id: number, data: UpdateClinicDto): Promise<Clinic> {
    const res = await api.patch<Clinic>(`/clinics/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clinics/${id}`);
  },
};

export default clinicApi;
