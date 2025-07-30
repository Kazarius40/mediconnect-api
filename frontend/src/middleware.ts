import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { setAccessCookie, setRefreshCookie } from '@/lib/auth/setCookie';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (accessToken || !refreshToken) {
    return NextResponse.next();
  }

  const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  if (!refreshRes.ok) {
    return NextResponse.next();
  }

  const data = await refreshRes.json();
  const newAccess = data.accessToken;
  const setCookieHeader = refreshRes.headers.get('set-cookie');

  const res = NextResponse.next();

  if (newAccess) {
    setAccessCookie(newAccess, res);
  }

  if (setCookieHeader) {
    setRefreshCookie(setCookieHeader, res);
  }

  return res;
}
