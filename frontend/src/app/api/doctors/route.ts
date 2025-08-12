import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { Doctor } from '@/interfaces/doctor';

export async function GET() {
  try {
    const doctorsRes = await fetch(`${BACKEND_URL}/doctors`, {});

    if (!doctorsRes.ok) {
      return NextResponse.json(
        { doctors: [], message: 'Error fetching doctors' },
        { status: doctorsRes.status },
      );
    }

    const doctors: Doctor[] = await doctorsRes.json();
    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { doctors: [], message: 'Internal server error' },
      { status: 500 },
    );
  }
}
