import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { Clinic } from '@/interfaces/clinic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const clinicId = (await params).id;

  try {
    const clinicRes = await fetch(`${BACKEND_URL}/clinics/${clinicId}`);

    if (!clinicRes.ok) {
      return NextResponse.json(
        { clinic: null, message: 'Error fetching clinic' },
        { status: clinicRes.status },
      );
    }

    const clinic: Clinic = await clinicRes.json();
    return NextResponse.json({ clinic });
  } catch (error) {
    console.error('Error fetching clinic:', error);
    return NextResponse.json(
      { clinic: null, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
