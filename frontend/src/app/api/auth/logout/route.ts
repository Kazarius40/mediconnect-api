import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { clearAuthCookies } from '@/lib/auth/setCookie';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (refreshToken) {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
  }

  const response = NextResponse.json({ message: 'Logged out' });

  clearAuthCookies(response);

  return response;
}
