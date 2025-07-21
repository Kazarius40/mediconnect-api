import {
  BackendError,
  BackendErrorResponse,
} from '@/interfaces/errors/backend-error.interface';

export function parseBackendErrors(err: any): BackendError[] {
  const data = err?.response?.data as BackendErrorResponse | undefined;

  if (!data) {
    return [{ message: 'Unknown error occurred' }];
  }

  if (Array.isArray(data.errors)) {
    return data.errors;
  }

  if (typeof data.message === 'string') {
    return [{ message: data.message }];
  }

  if (Array.isArray(data.message)) {
    return data.message.map((msg) => ({ message: msg }));
  }

  return [{ message: 'Unexpected error' }];
}

export function stringifyBackendErrors(err: any): string {
  return parseBackendErrors(err)
    .map((e) => e.message)
    .join(', ');
}
