import { FieldValues } from 'react-hook-form';
import { fieldMappings } from '@/utils/errors/field-mappings.config';

export function mapBackendErrorToField<T extends FieldValues>(
  msg: string,
  mappings = fieldMappings,
): keyof T | null {
  for (const { pattern, field } of mappings) {
    if (pattern.test(msg)) {
      return field as keyof T;
    }
  }

  const match = msg.match(/with (\w+) '.*' already exists/);
  if (match) {
    return match[1] as keyof T;
  }

  return null;
}
