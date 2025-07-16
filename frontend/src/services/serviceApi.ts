import {
  Service,
  ServiceFilterDto,
  CreateServiceDto,
  UpdateServiceDto,
} from '@/interfaces/service';
import api from '@/api/axios';

const serviceApi = {
  async getAll(filters?: ServiceFilterDto): Promise<Service[]> {
    const res = await api.get<Service[]>('/services', {
      params: filters,
    });
    return res.data;
  },

  async getById(id: number): Promise<Service> {
    const res = await api.get<Service>(`/services/${id}`);
    return res.data;
  },

  async create(dto: CreateServiceDto): Promise<Service> {
    const res = await api.post<Service>('/services', dto);
    return res.data;
  },

  async update(id: number, dto: UpdateServiceDto): Promise<Service> {
    const res = await api.patch<Service>(`/services/${id}`, dto);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/services/${id}`);
  },
};

export default serviceApi;
