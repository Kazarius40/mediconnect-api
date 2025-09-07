'use client';

import { Doctor } from '@/interfaces/doctor';

import './style.css';

interface DoctorCardProps {
  doctor: Doctor;
  onClick?: () => void;
}

const Card = ({ doctor, onClick }: DoctorCardProps) => {
  return (
    <div onClick={onClick} className="card-wrapper">
      <h2>
        {doctor.lastName} {doctor.firstName}
      </h2>
      {doctor.phone && (
        <p>
          <strong>Phone:</strong> {doctor.phone}
        </p>
      )}
      {doctor.email && (
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
      )}
    </div>
  );
};

export default Card;
