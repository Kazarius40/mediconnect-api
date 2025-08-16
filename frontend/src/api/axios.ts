import axios from 'axios';
import { BACKEND_URL } from '@/config/backend';

export default axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
