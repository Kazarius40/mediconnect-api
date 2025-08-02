import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { User } from '@/interfaces/user/user';

export async function GET(
  req: NextRequest,
  context: Promise<{ params: { id: string } }>,
) {
  const { params } = await context;
  const userId = Number(params.id);

  const accessToken = req.cookies.get('accessToken')?.value;

  const userRes = await fetch(`${BACKEND_URL}/auth/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userRes.ok) {
    return NextResponse.json({ user: null }, { status: userRes.status });
  }

  const user: User = await userRes.json();
  return NextResponse.json({ user });
}
