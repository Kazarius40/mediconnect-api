'use client';

import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="auth-page">
      <h1 className="text-3xl font-bold mb-4 text-center">Registration</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
