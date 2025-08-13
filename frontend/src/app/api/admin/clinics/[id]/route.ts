import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const clinicId = (await params).id;
  const accessToken = req.cookies.get('accessToken')?.value;

  const body = await req.json();

  const clinicRes = await fetch(`${BACKEND_URL}/clinics/${clinicId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await clinicRes.json();
  return NextResponse.json(data, { status: clinicRes.status });
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const clinicId = (await params).id;
  const accessToken = req.cookies.get('accessToken')?.value;

  await fetch(`${BACKEND_URL}/clinics/${clinicId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return NextResponse.json(
    { message: 'Clinic deleted successfully' },
    { status: 200 },
  );
}
