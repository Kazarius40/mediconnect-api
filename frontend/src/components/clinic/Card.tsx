'use client';

import './style.css';
import { Clinic } from '@/interfaces/clinic';

interface ClinicCardProps {
  clinic: Clinic;
  onClick?: () => void;
}

const Card = ({ clinic, onClick }: ClinicCardProps) => {
  return (
    <div onClick={onClick} className="clinic-card">
      <h2 className="clinic-card-title">{clinic.name}</h2>
      <p className="clinic-card-info">
        <strong>Address:</strong> {clinic.address}
      </p>
      <p className="clinic-card-info">
        <strong>Phone:</strong> {clinic.phone}
      </p>
      <p className="clinic-card-info">
        <strong>Email:</strong> {clinic.email}
      </p>
    </div>
  );
};

export default Card;
