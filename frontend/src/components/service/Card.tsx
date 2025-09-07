'use client';

import { Service } from '@/interfaces/service';

import './style.css';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

const Card = ({ service, onClick }: ServiceCardProps) => {
  return (
    <div className="card-wrapper" onClick={onClick}>
      <h2>{service.name}</h2>
      <p>{service.description || 'No description'}</p>
    </div>
  );
};

export default Card;
