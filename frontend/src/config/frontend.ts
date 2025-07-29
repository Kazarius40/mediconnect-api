export const FRONTEND_URL =
  typeof window === 'undefined'
    ? process.env.INTERNAL_FRONTEND_URL || 'http://frontend:3001'
    : '';
