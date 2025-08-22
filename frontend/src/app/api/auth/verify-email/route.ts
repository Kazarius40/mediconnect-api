import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { message: 'Missing verification token' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message ?? 'Verification failed' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: data?.message ?? 'Email verified successfully!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message ?? 'Verification failed' },
      { status: 500 },
    );
  }
}
