// // lib/auth/requireAdminUser.ts
// import { redirect } from 'next/navigation';
// import { ssrFetchUser } from '@/lib/auth/ssrAuth';
//
// export async function requireAdminUser() {
//   const { user, newAccessToken } = await ssrFetchUser();
//
//   if (!user) {
//     redirect('/auth/login');
//   }
//
//   if (user.role !== 'ADMIN') {
//     redirect('/'); // або /403
//   }
//
//   return { user, token: newAccessToken ?? '' };
// }
