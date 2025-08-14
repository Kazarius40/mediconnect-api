'use client';

import React from 'react';
import { Clinic } from '@/interfaces/clinic';

interface ClinicCardProps {
  clinic: Clinic;
  onClick?: () => void;
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-blue-500 hover:bg-blue-50"
    >
      <h2 className="text-xl font-bold mb-2">{clinic.name}</h2>
      <p className="text-sm text-gray-700">
        <strong>Address:</strong> {clinic.address}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Phone:</strong> {clinic.phone}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Email:</strong> {clinic.email}
      </p>
    </div>
  );
};

export default ClinicCard;
