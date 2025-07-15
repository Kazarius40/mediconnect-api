'use client';

import React, { useEffect, useState } from 'react';
import ServiceCard from '@/components/services/ServiceCard';
import { useRouter } from 'next/navigation';
import serviceService from '@/services/serviceApi';
import { Service } from '@/interfaces/service';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    serviceService
      .getAll()
      .then((response) => {
        setServices(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load services');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Services</h1>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          name={service.name}
          description={service.description}
          onClick={() => router.push(`/services/${service.id}`)}
        />
      ))}
    </div>
  );
};

export default ServicesPage;
