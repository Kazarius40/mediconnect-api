import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieHeader = req.headers.get('cookie') ?? '';
    const accessToken = cookieHeader.match(/accessToken=([^;]+)/)?.[1];

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized: no access token' },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json();
      return NextResponse.json(
        { error: errorData.message || 'Update failed' },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
