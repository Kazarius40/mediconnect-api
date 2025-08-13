import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { Doctor } from '@/interfaces/doctor';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const doctorId = (await params).id;

  try {
    const doctorRes = await fetch(`${BACKEND_URL}/doctors/${doctorId}`);

    if (!doctorRes.ok) {
      return NextResponse.json(
        { doctor: null, message: 'Error fetching doctor' },
        { status: doctorRes.status },
      );
    }

    const doctor: Doctor = await doctorRes.json();
    return NextResponse.json({ doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { doctor: null, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
