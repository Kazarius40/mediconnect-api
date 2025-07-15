export function normalizePhoneFrontend(phone: string): string {
  if (!phone) return phone;

  const digits = phone.replace(/\D/g, '');

  if (/^0\d{9}$/.test(digits)) {
    return '+380' + digits.slice(1);
  }

  if (/^380\d{9}$/.test(digits)) {
    return '+' + digits;
  }

  return phone;
}
