import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { Clinic } from '@/interfaces/clinic';

export async function GET() {
  try {
    const clinicsRes = await fetch(`${BACKEND_URL}/clinics`, {});

    if (!clinicsRes.ok) {
      return NextResponse.json(
        { clinics: [], message: 'Error fetching clinics' },
        { status: clinicsRes.status },
      );
    }

    const clinics: Clinic[] = await clinicsRes.json();
    return NextResponse.json({ clinics });
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return NextResponse.json(
      { clinics: [], message: 'Internal server error' },
      { status: 500 },
    );
  }
}
