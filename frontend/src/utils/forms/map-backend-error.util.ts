import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export function mapBackendErrorToField(msg: string): keyof any | null {
  const lower = msg.toLowerCase();

  if (lower.includes('phone')) return 'phone';
  if (lower.includes('email')) return 'email';
  if (
    lower.includes('name') &&
    !lower.includes('first') &&
    !lower.includes('last')
  )
    return 'name';
  if (lower.includes('first')) return 'firstName';
  if (lower.includes('last')) return 'lastName';
  if (lower.includes('address')) return 'address';

  return null;
}

export function handleBackendFieldError<T extends FieldValues>(
  setError: UseFormSetError<T>,
  msg: string,
) {
  const field = mapBackendErrorToField(msg);

  if (field) {
    setError(field as Path<T>, {
      type: 'manual',
      message: msg,
    });
  }
}
