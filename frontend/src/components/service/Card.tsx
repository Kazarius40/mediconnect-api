'use client';

import { Service } from '@/interfaces/service';

import './style.css';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

const Card = ({ service, onClick }: ServiceCardProps) => {
  return (
    <div className="service-card" onClick={onClick}>
      <h2 className="service-card-title">{service.name}</h2>
      <p className="service-card-description">
        {service.description || 'No description'}
      </p>
    </div>
  );
};

export default Card;
