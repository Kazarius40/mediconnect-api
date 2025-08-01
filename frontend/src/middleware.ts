import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import {
  clearAuthCookies,
  setAccessCookie,
  setRefreshCookie,
} from '@/lib/auth/setCookie';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (accessToken) {
    const profileRes = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (profileRes.ok) return NextResponse.next();
  }

  if (!refreshToken) return NextResponse.next();

  const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  if (!refreshRes.ok) {
    const failRes = NextResponse.redirect(new URL('/auth/login', req.url));
    clearAuthCookies(failRes);
    return failRes;
  }

  const data = await refreshRes.json();
  const newAccess = data.accessToken;
  const setCookieHeader = refreshRes.headers.get('set-cookie');

  const res = NextResponse.next();

  if (newAccess) setAccessCookie(newAccess, res);
  if (setCookieHeader) setRefreshCookie(setCookieHeader, res);

  return res;
}
