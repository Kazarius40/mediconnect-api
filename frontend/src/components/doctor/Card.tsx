'use client';

import { Doctor } from '@/interfaces/doctor';

import './style.css';

interface DoctorCardProps {
  doctor: Doctor;
  onClick?: () => void;
}

const Card = ({ doctor, onClick }: DoctorCardProps) => {
  return (
    <div onClick={onClick} className="doctor-card">
      <h2 className="doctor-card-title">
        {doctor.lastName} {doctor.firstName}
      </h2>
      {doctor.phone && (
        <p className="doctor-card-info">
          <strong>Phone:</strong> {doctor.phone}
        </p>
      )}
      {doctor.email && (
        <p className="doctor-card-info">
          <strong>Email:</strong> {doctor.email}
        </p>
      )}
    </div>
  );
};

export default Card;
