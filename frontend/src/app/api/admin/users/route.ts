import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { User } from '@/interfaces/user';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;

  const usersRes = await fetch(`${BACKEND_URL}/auth/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!usersRes.ok) {
    return NextResponse.json({ user: null }, { status: usersRes.status });
  }

  const users: User[] = await usersRes.json();
  return NextResponse.json({ users });
}
