import { redirect } from 'next/navigation';
import { Service } from '@/interfaces/service';
import ServiceViewClient from '@/components/services/ServiceViewClient';
import { getServiceById } from '@/lib/api/services';

export default async function ServiceViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const serviceId = Number(resolvedParams.id);

  if (!serviceId) redirect(`/services`);

  let service: Service | null = null;

  try {
    service = await getServiceById(serviceId);
  } catch (e) {
    console.error('Failed to fetch service', e);
    redirect(`/services`);
  }

  return <ServiceViewClient service={service} />;
}
