'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/api/auth';
import { AxiosError } from 'axios';

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token');
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setMessage(response.data.message || 'Email verified successfully!');
        setStatus('success');
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setMessage(axiosError.response?.data?.message || 'Verification failed');
        setStatus('error');
      }
    };

    void verify();
  }, [token]);

  const goToLogin = () => router.push('/auth/login');

  return (
    <div className="max-w-md mx-auto text-center mt-20 space-y-4">
      {status === 'loading' && (
        <div className="text-gray-500">Verifying your email...</div>
      )}

      {status === 'success' && (
        <>
          <div className="text-green-600 font-bold">{message}</div>
          <button
            onClick={goToLogin}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-red-600 font-bold">{message}</div>
          <button
            onClick={goToLogin}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Login
          </button>
        </>
      )}
    </div>
  );
}
