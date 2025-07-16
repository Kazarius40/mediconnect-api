'use client';

import React from 'react';

interface DoctorCardProps {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  onClick?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  firstName,
  lastName,
  phone,
  email,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-blue-500 hover:bg-blue-50"
    >
      <h2 className="text-xl font-bold mb-2">
        {lastName} {firstName}
      </h2>
      {phone && (
        <p className="text-sm text-gray-700">
          <strong>Phone:</strong> {phone}
        </p>
      )}
      {email && (
        <p className="text-sm text-gray-700">
          <strong>Email:</strong> {email}
        </p>
      )}
    </div>
  );
};

export default DoctorCard;
