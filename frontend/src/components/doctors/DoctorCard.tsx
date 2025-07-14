'use client';

import React from 'react';

interface DoctorCardProps {
  fullName: string;
  specialty: string;
  onClick?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  fullName,
  specialty,
  onClick,
}) => {
  return (
    <div
      className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold mb-2">{fullName}</h2>
      <p className="text-sm text-gray-700">
        <strong>Specialty:</strong> {specialty}
      </p>
    </div>
  );
};

export default DoctorCard;
