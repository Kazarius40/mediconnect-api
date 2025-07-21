import { Transform } from 'class-transformer';
import parsePhoneNumberFromString from 'libphonenumber-js';

export function normalizePhone(phone: string): string {
  if (!phone) return phone;

  const parsed = parsePhoneNumberFromString(phone, 'UA');

  if (!parsed || !parsed.isValid()) return phone;

  return parsed.format('E.164');
}

export function TransformNormalizePhone() {
  return Transform(({ value }) =>
    value ? normalizePhone(value as string) : (value as string),
  );
}
