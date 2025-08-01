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

  const redirectUrl = new URL('/auth/login', req.url);
  redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);

  async function refresh(token: string) {
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${token}`,
      },
    });

    if (!refreshRes.ok) {
      const failRes = NextResponse.redirect(redirectUrl);
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

  if (accessToken) {
    try {
      const payload = JSON.parse(
        Buffer.from(accessToken.split('.')[1], 'base64').toString(),
      );
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = payload.exp - currentTime;

      if (expiresIn < 30) {
        if (!refreshToken) return NextResponse.next();

        return await refresh(refreshToken);
      }
      const profileRes = await fetch(`${BACKEND_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!profileRes.ok) {
        if (!refreshToken) return NextResponse.next();
        return await refresh(refreshToken);
      }

      return NextResponse.next();
    } catch (err) {
      if (refreshToken) {
        return await refresh(refreshToken);
      } else {
        const failRes = NextResponse.redirect(redirectUrl);
        clearAuthCookies(failRes);
        return failRes;
      }
    }
  }

  if (refreshToken) {
    return await refresh(refreshToken);
  }

  return NextResponse.next();
}
