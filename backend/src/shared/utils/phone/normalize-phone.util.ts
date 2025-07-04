import { Transform } from 'class-transformer';

export function normalizePhone(phone: string): string {
  if (!phone) return phone;

  const digits = phone.replace(/\D/g, '');

  if (/^0\d{9}$/.test(digits)) {
    return '+38' + digits;
  }

  if (/^380\d{9}$/.test(digits)) {
    return '+' + digits;
  }

  return phone;
}

export function TransformNormalizePhone() {
  return Transform(({ value }) =>
    value ? normalizePhone(value as string) : (value as string),
  );
}
