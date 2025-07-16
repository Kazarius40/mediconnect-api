import axios from 'axios';
import { addAuthInterceptor } from '@/api/interceptors';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

addAuthInterceptor(api);

export default api;
