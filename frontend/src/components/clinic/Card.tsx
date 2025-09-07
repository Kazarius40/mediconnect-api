'use client';

import { Clinic } from '@/interfaces/clinic';

import './style.css';

interface ClinicCardProps {
  clinic: Clinic;
  onClick?: () => void;
}

const Card = ({ clinic, onClick }: ClinicCardProps) => {
  return (
    <div onClick={onClick} className="card-wrapper">
      <h2>{clinic.name}</h2>
      <p>
        <strong>Address:</strong> {clinic.address}
      </p>
      <p>
        <strong>Phone:</strong> {clinic.phone}
      </p>
      <p>
        <strong>Email:</strong> {clinic.email}
      </p>
    </div>
  );
};

export default Card;
