import { normalizePhoneFrontend } from '@/utils/phone/normalize-phone.util';

export function normalizeFormData<T extends { phone?: string; email?: string }>(
  data: T,
): T {
  const copy = { ...data };

  if (copy.phone) {
    copy.phone = normalizePhoneFrontend(copy.phone);
  }

  if (!copy.email || copy.email.trim() === '') {
    delete copy.email;
  }

  return copy;
}
