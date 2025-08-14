import Link from 'next/link';
import { verifyEmail } from '@/api/client/auth';

export default async function VerifyEmailPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParams = await props.searchParams;
  const token = searchParams?.token;

  if (!token) {
    return (
      <div className="max-w-md mx-auto text-center mt-20 space-y-4">
        <div className="text-red-600 font-bold">Missing verification token</div>
        <Link
          href="/auth/login"
          className="mt-4 inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  let status: 'success' | 'error' = 'success';
  let message;

  try {
    const response = await verifyEmail({ token });
    message = response.data?.message ?? 'Email verified successfully!';
  } catch (err: any) {
    status = 'error';
    message = err?.message ?? 'Verification failed';
  }

  return (
    <div className="max-w-md mx-auto text-center mt-20 space-y-4">
      {status === 'success' ? (
        <>
          <div className="text-green-600 font-bold">{message}</div>
          <Link
            href="/auth/login"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </>
      ) : (
        <>
          <div className="text-red-600 font-bold">{message}</div>
          <Link
            href="/auth/login"
            className="mt-4 inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Login
          </Link>
        </>
      )}
    </div>
  );
}
