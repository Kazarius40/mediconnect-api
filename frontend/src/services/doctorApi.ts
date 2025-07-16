import {
  Doctor,
  DoctorFilterDto,
  CreateDoctorDto,
  UpdateDoctorDto,
} from '@/interfaces/doctor';
import api from '@/api/axios';

const doctorApi = {
  async getAll(filters?: DoctorFilterDto): Promise<Doctor[]> {
    const res = await api.get<Doctor[]>('/doctors', {
      params: filters,
    });
    return res.data;
  },

  async getById(id: number): Promise<Doctor> {
    const res = await api.get<Doctor>(`/doctors/${id}`);
    return res.data;
  },

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    const res = await api.post<Doctor>('/doctors', dto);
    return res.data;
  },

  async update(id: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const res = await api.patch<Doctor>(`/doctors/${id}`, dto);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/doctors/${id}`);
  },
};

export default doctorApi;
