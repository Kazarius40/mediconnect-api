'use client';

import React from 'react';
import { Doctor } from '@/interfaces/doctor';

interface DoctorCardProps {
  doctor: Doctor;
  onClick?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-blue-500 hover:bg-blue-50"
    >
      <h2 className="text-xl font-bold mb-2">
        {doctor.lastName} {doctor.firstName}
      </h2>
      {doctor.phone && (
        <p className="text-sm text-gray-700">
          <strong>Phone:</strong> {doctor.phone}
        </p>
      )}
      {doctor.email && (
        <p className="text-sm text-gray-700">
          <strong>Email:</strong> {doctor.email}
        </p>
      )}
    </div>
  );
};

export default DoctorCard;
