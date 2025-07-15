import { AxiosResponse } from 'axios';
import { Service } from '@/interfaces/service';
import api from '@/api/axios';

const getAll = (): Promise<AxiosResponse<Service[]>> => {
  return api.get('/services');
};

const getById = (id: number): Promise<AxiosResponse<Service>> => {
  return api.get(`/services/${id}`);
};

export default {
  getAll,
  getById,
};
