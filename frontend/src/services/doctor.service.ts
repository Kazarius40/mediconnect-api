import { Doctor } from '@/interfaces/doctor';
import api from '@/api/axios';

const doctorService = {
  async getAll(): Promise<Doctor[]> {
    const res = await api.get('/doctors');
    return res.data;
  },

  async getById(id: number): Promise<Doctor> {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },
};

export default doctorService;
