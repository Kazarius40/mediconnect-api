import React from 'react';
import { Doctor } from '@/interfaces/doctor';

interface ServiceCardProps {
  name: string;
  description: string | null;
  doctors?: Doctor[];
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  description,
  doctors,
  onClick,
}) => {
  return (
    <div
      className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm text-gray-700">{description || 'No description'}</p>
      {doctors?.length ? (
        <p className="mt-2 text-sm text-gray-600">
          <strong>Doctors:</strong>{' '}
          {doctors.map((d) => `${d.firstName} ${d.lastName}`).join(', ')}
        </p>
      ) : null}
    </div>
  );
};

export default ServiceCard;
