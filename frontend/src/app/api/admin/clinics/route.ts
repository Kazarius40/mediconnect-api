import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;

  const body = await req.json();

  const clinicsRes = await fetch(`${BACKEND_URL}/clinics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await clinicsRes.json();
  return NextResponse.json(data, { status: clinicsRes.status });
}
