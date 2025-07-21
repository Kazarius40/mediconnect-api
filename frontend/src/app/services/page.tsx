'use client';

import React, { useEffect, useState } from 'react';
import ServiceCard from '@/components/services/ServiceCard';
import { useRouter } from 'next/navigation';
import serviceApi from '@/services/serviceApi';
import { Service } from '@/interfaces/service';
import { matchesSearch } from '@/utils/common/search.util';
import SortControls from '@/components/common/SortControls';
import { authProvider } from '@/providers/AuthProvider';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const { user, loading: userLoading } = authProvider();
  const router = useRouter();

  const sortFields = [{ value: 'name', label: 'Name' }];

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await serviceApi.getAll({
        sortBy,
        sortOrder,
      });
      setServices(data);
    } catch (e) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, [sortBy, sortOrder]);

  const filteredServices = services.filter((service) =>
    matchesSearch(searchTerm, [service.name, service.description ?? '']),
  );

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Services</h1>

      {!userLoading && user?.role === 'ADMIN' && (
        <button
          onClick={() => router.push('/admin/services/create')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create Service
        </button>
      )}

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search services by name or description"
        className="w-full max-w-md p-2 border rounded mb-4"
      />

      <SortControls
        sortFields={sortFields}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      {filteredServices.length === 0 && (
        <p className="text-gray-500">No services found.</p>
      )}

      {filteredServices.map((service) => (
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
