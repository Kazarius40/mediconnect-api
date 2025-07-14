import { AxiosResponse } from 'axios';
import { Clinic, CreateClinicDto, UpdateClinicDto } from '@/interfaces/clinic';
import api from '@/api/axios';

const clinicService = {
  getAll(): Promise<AxiosResponse<Clinic[]>> {
    return api.get('/clinics');
  },

  getById(id: number): Promise<AxiosResponse<Clinic>> {
    return api.get(`/clinics/${id}`);
  },

  create(data: CreateClinicDto): Promise<AxiosResponse<Clinic>> {
    return api.post('/clinics', data);
  },

  update(id: number, data: UpdateClinicDto): Promise<AxiosResponse<Clinic>> {
    return api.patch(`/clinics/${id}`, data);
  },
};

export default clinicService;
