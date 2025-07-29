'use client';

import React from 'react';

interface ClinicCardProps {
  name: string;
  address: string;
  phone: string;
  email: string | null;
  onClick?: () => void;
}

const ClinicCard: React.FC<ClinicCardProps> = ({
  name,
  address,
  phone,
  email,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-blue-500 hover:bg-blue-50"
    >
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-sm text-gray-700">
        <strong>Address:</strong> {address}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Phone:</strong> {phone}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Email:</strong> {email}
      </p>
    </div>
  );
};

export default ClinicCard;
