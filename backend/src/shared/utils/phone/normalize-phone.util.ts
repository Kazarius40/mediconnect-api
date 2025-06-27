export function normalizePhone(phone: string): string {
  if (!phone) return phone;
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') || digits.startsWith('380')
    ? `+${digits}`
    : phone;
}
