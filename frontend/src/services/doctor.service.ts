import { AxiosResponse } from 'axios';
import { Doctor } from '@/interfaces/doctor';
import api from '@/api/axios';

const getAll = (): Promise<AxiosResponse<Doctor[]>> => {
  return api.get('/doctors');
};

const getById = (id: number): Promise<AxiosResponse<Doctor>> => {
  return api.get(`/doctors/${id}`);
};

export default {
  getAll,
  getById,
};
