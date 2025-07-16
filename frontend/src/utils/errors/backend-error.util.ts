import { FieldValues, UseFormSetError } from 'react-hook-form';
import { handleBackendFieldError } from '@/utils/forms/map-backend-error.util';

export function processBackendErrors<T extends FieldValues>(
  err: any,
  setError: UseFormSetError<T>,
) {
  console.error('Save error:', err.response?.data || err.message);

  const backendMessage = err.response?.data?.message;

  if (typeof backendMessage === 'string') {
    handleBackendFieldError<T>(setError, backendMessage);
  } else if (Array.isArray(backendMessage)) {
    backendMessage.forEach((msg: string) =>
      handleBackendFieldError<T>(setError, msg),
    );
  }
}
