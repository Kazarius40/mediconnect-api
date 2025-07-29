import { redirect } from 'next/navigation';
import { Service } from '@/interfaces/service';
import ServicesPageClient from '@/components/services/ServicesPageClient';
import { getServices } from '@/lib/api/services';

export default async function ServicesPage() {
  let services: Service[] = [];

  try {
    services = await getServices();
  } catch (e) {
    console.error('Failed to fetch services', e);
    redirect('/');
  }

  return <ServicesPageClient services={services} />;
}
