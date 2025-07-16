import { Service } from '@/interfaces/service';
import api from '@/api/axios';

const serviceApi = {
  async getAll(): Promise<Service[]> {
    const res = await api.get<Service[]>('/services');
    return res.data;
  },

  async getById(id: number): Promise<Service> {
    const res = await api.get<Service>(`/services/${id}`);
    return res.data;
  },
};

export default serviceApi;
