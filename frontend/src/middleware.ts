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

  const redirectUrl = req.nextUrl.clone();
  const res = NextResponse.redirect(redirectUrl);

  if (newAccess) {
    setAccessCookie(newAccess, res);
  }

  const setCookieHeader = refreshRes.headers.get('set-cookie');
  setRefreshCookie(setCookieHeader, res);

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
