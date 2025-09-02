'use client';

import './style.css';
import { Clinic } from '@/interfaces/clinic';

interface ClinicCardProps {
  clinic: Clinic;
  onClick?: () => void;
}

const Card = ({ clinic, onClick }: ClinicCardProps) => {
  return (
    <div onClick={onClick} className="card-wrapper">
      <h2 className="card-title">{clinic.name}</h2>
      <p className="card-info">
        <strong>Address:</strong> {clinic.address}
      </p>
      <p className="card-info">
        <strong>Phone:</strong> {clinic.phone}
      </p>
      <p className="card-info">
        <strong>Email:</strong> {clinic.email}
      </p>
    </div>
  );
};

export default Card;
