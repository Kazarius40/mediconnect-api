import { NextRequest, NextResponse } from 'next/server';
import { getAllUsersFromServer } from '@/lib/api';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const users = await getAllUsersFromServer(token);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}
