import {
  Clinic,
  ClinicFilterDto,
  CreateClinicDto,
  UpdateClinicDto,
} from '@/interfaces/clinic';
import api from '@/api/axios';

const clinicApi = {
  async getAll(filters?: ClinicFilterDto): Promise<Clinic[]> {
    const res = await api.get<Clinic[]>('/clinics', {
      params: filters,
    });
    return res.data;
  },

  async getById(id: number): Promise<Clinic> {
    const res = await api.get<Clinic>(`/clinics/${id}`);
    return res.data;
  },

  async create(dto: CreateClinicDto): Promise<Clinic> {
    const res = await api.post<Clinic>('/clinics', dto);
    return res.data;
  },

  async update(id: number, dto: UpdateClinicDto): Promise<Clinic> {
    const res = await api.patch<Clinic>(`/clinics/${id}`, dto);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clinics/${id}`);
  },
};

export default clinicApi;
