import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json({ message: 'No access token' }, { status: 401 });
    }

    const profileRes = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileRes.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch profile' },
        { status: profileRes.status },
      );
    }

    const user = await profileRes.json();

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
