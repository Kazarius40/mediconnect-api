export const PUBLIC_PATHS = [
  '/',
  '/register',
  '/auth/email-sent',
  '/auth/forgot-password',
  '/auth/login',
  '/auth/reset-password',
  '/auth/verify-email',
  '/clinics',
  '/doctors',
  '/services',
];

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(publicPath + '/'),
  );
}
