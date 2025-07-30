import { NextResponse } from 'next/server';

export function setRefreshCookie(
  setCookieHeader: string | null,
  response: NextResponse,
): void {
  if (!setCookieHeader) return;

  const match = setCookieHeader.match(/refreshToken=([^;]+);/);

  if (match && match[1]) {
    response.cookies.set('refreshToken', match[1], {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });
  }
}

export function setAccessCookie(
  accessToken: string,
  response: NextResponse,
): void {
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 5,
    sameSite: 'lax',
  });
}
