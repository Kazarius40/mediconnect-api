import React from 'react';

interface ServiceCardProps {
  name: string;
  description: string | null;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  description,
  onClick,
}) => {
  return (
    <div
      className="cursor-pointer border rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-blue-500 hover:bg-blue-50"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-sm text-gray-700">{description || 'No description'}</p>
    </div>
  );
};

export default ServiceCard;
