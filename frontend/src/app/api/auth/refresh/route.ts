import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { setRefreshCookieFromHeader } from '@/lib/auth/setRefreshCookie';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token' },
        { status: 401 },
      );
    }

    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Refresh failed' }, { status: 401 });
    }

    const { accessToken } = await res.json();
    const setCookieHeader = res.headers.get('set-cookie');

    const profileRes = await fetch(`${BACKEND_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return NextResponse.json(
        { message: 'Profile fetch failed' },
        { status: 500 },
      );
    }

    const user = await profileRes.json();

    const response = NextResponse.json({ accessToken, user });

    setRefreshCookieFromHeader(setCookieHeader, response);

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
