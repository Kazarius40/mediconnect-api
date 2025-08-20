'use client';

import './style.css';
import React from 'react';
import LoginForm from '@/components/auth/LoginForm/LoginForm';

export default function Login() {
  return (
    <div className="wrapper">
      <LoginForm />
    </div>
  );
}
