// export const BACKEND_URL =
//   typeof window === 'undefined' ? 'http://nginx' : '/api';

export const BACKEND_URL =
  typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL || 'http://api:3000'
    : process.env.NEXT_PUBLIC_API_URL || '/api';
