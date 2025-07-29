import { NextResponse } from 'next/server';

export function setRefreshCookieFromHeader(
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
