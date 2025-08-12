import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { User } from '@/interfaces/user/user';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.id);

  const accessToken = req.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { user: null, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
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
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { user: null, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  const accessToken = req.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    let data = {};
    try {
      data = await res.json();
    } catch {}
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
