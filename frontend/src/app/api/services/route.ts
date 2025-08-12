import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/config/backend';
import { Service } from '@/interfaces/service';

export async function GET() {
  try {
    const servicesRes = await fetch(`${BACKEND_URL}/services`, {});

    if (!servicesRes.ok) {
      return NextResponse.json(
        { services: [], message: 'Error fetching services' },
        { status: servicesRes.status },
      );
    }

    const services: Service[] = await servicesRes.json();
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { services: [], message: 'Internal server error' },
      { status: 500 },
    );
  }
}
