'use client';

import Form from '@/components/auth/register/Form';

import './style.css';

export default function Register() {
  return (
    <div className="auth-page">
      <h1 className="auth-title">Registration</h1>
      <Form />
    </div>
  );
}
