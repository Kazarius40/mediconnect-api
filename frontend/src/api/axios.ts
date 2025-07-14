import axios from 'axios';
import { addAuthInterceptor } from '@/api/interceptors';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

addAuthInterceptor(api);

export default api;
