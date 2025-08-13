import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serviceId = (await params).id;
  const accessToken = req.cookies.get('accessToken')?.value;
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/services/${serviceId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const serviceId = (await params).id;
  const accessToken = req.cookies.get('accessToken')?.value;

  await fetch(`${BACKEND_URL}/services/${serviceId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return NextResponse.json(
    { message: 'Service deleted successfully' },
    { status: 200 },
  );
}
