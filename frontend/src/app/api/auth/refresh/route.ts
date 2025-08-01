// import { NextRequest, NextResponse } from 'next/server';
// import { BACKEND_URL } from '@/config/backend';
// import {
//   clearAuthCookies,
//   setAccessCookie,
//   setRefreshCookie,
// } from '@/lib/auth/setCookie';
//
// export async function POST(req: NextRequest) {
//   try {
//     const refreshToken = req.cookies.get('refreshToken')?.value;
//     if (!refreshToken) {
//       return NextResponse.json(
//         { message: 'No refresh token' },
//         { status: 401 },
//       );
//     }
//
//     const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
//       method: 'POST',
//       headers: {
//         Cookie: `refreshToken=${refreshToken}`,
//       },
//     });
//
//     if (!res.ok) {
//       const failRes = NextResponse.json(
//         { message: 'Refresh failed' },
//         { status: 401 },
//       );
//       clearAuthCookies(failRes);
//       return failRes;
//     }
//
//     const { accessToken } = await res.json();
//
//     const setCookieHeader = res.headers.get('set-cookie');
//
//     const profileRes = await fetch(`${BACKEND_URL}/auth/profile`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//
//     if (!profileRes.ok) {
//       const failRes = NextResponse.json(
//         { message: 'Profile fetch failed' },
//         { status: 500 },
//       );
//       clearAuthCookies(failRes);
//       return failRes;
//     }
//
//     const user = await profileRes.json();
//     const response = NextResponse.json({ user, accessToken });
//
//     if (accessToken) setAccessCookie(accessToken, response);
//     if (setCookieHeader) setRefreshCookie(setCookieHeader, response);
//
//     return response;
//   } catch (error) {
//     console.error('Refresh API error:', error);
//     const failRes = NextResponse.json(
//       { message: 'Internal Server Error' },
//       { status: 500 },
//     );
//     clearAuthCookies(failRes);
//     return failRes;
//   }
// }
