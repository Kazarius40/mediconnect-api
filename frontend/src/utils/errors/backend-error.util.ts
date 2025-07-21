import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { mapBackendErrorToField } from '@/utils/errors/map-backend-error.util';
import { parseBackendErrors } from '@/utils/errors/parse-backend-errors.util';

export function processBackendErrors<T extends FieldValues>(
  err: any,
  setError: UseFormSetError<T>,
) {
  const errors = parseBackendErrors(err);

  errors.forEach(({ field, message }) => {
    if (field) {
      setError(field as Path<T>, { type: 'manual', message });
    } else {
      const mappedField = mapBackendErrorToField<T>(message);
      if (mappedField) {
        setError(mappedField as Path<T>, { type: 'manual', message });
      } else {
        console.warn('Unmapped backend error:', message);
      }
    }
  });
}
