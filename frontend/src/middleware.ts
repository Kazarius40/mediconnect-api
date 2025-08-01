import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import {
  clearAuthCookies,
  setAccessCookie,
  setRefreshCookie,
} from '@/lib/auth/setCookie';
import { isAccessTokenExpired } from '@/lib/auth/token';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const redirectUrl = new URL('/auth/login', req.url);

  const redirectToLogin = () => {
    const res = NextResponse.redirect(redirectUrl);
    clearAuthCookies(res);
    return res;
  };

  const refresh = async (token: string) => {
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `refreshToken=${token}` },
    });

    if (!refreshRes.ok) return redirectToLogin();

    const data = await refreshRes.json();
    const newAccess = data.accessToken;
    const setCookieHeader = refreshRes.headers.get('set-cookie');

    const res = NextResponse.next();
    if (newAccess) setAccessCookie(newAccess, res);
    if (setCookieHeader) setRefreshCookie(setCookieHeader, res);
    return res;
  };

  if (accessToken) {
    if (isAccessTokenExpired(accessToken)) {
      return refreshToken ? await refresh(refreshToken) : NextResponse.next();
    }

    const profileRes = await fetch(`${BACKEND_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return refreshToken ? await refresh(refreshToken) : NextResponse.next();
    }

    return NextResponse.next();
  }

  if (refreshToken) {
    return await refresh(refreshToken);
  }

  return NextResponse.next();
}
