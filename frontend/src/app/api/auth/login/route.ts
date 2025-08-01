import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { setAccessCookie, setRefreshCookie } from '@/lib/auth/setCookie';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!loginRes.ok) {
      const error = await loginRes.json();
      return NextResponse.json(error, { status: loginRes.status });
    }

    const { accessToken } = await loginRes.json();
    const setCookieHeader = loginRes.headers.get('set-cookie');

    const profileRes = await fetch(`${BACKEND_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch profile after login' },
        { status: profileRes.status },
      );
    }

    const user = await profileRes.json();

    const response = NextResponse.json({ accessToken, user });

    setRefreshCookie(setCookieHeader, response);
    setAccessCookie(accessToken, response);

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
