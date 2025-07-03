import { Transform } from 'class-transformer';

export function normalizePhone(phone: string): string {
  if (!phone) return phone;
  const digits = phone.replace(/\D/g, '');
  return '+' + digits;
}

export function TransformNormalizePhone() {
  return Transform(({ value }) =>
    value ? normalizePhone(value as string) : (value as string),
  );
}
