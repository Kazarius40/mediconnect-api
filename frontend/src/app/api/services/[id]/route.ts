import { BACKEND_URL } from '@/config/backend';
import { NextResponse } from 'next/server';
import { Service } from '@/interfaces/service';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const serviceId = resolvedParams.id;

  try {
    const serviceRes = await fetch(`${BACKEND_URL}/services/${serviceId}`);

    if (!serviceRes.ok) {
      return NextResponse.json(
        { service: null, message: 'Error fetching service' },
        { status: serviceRes.status },
      );
    }

    const service: Service = await serviceRes.json();
    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { service: null, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
