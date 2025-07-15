import React from 'react';

export function normalizePhoneFrontend(phone: string): string {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');

  if (/^0\d{9}$/.test(digits)) {
    return '+380' + digits.slice(1);
  }

  if (/^380\d{9}$/.test(digits)) {
    return '+' + digits;
  }

  return '';
}

export const handlePhoneKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    '(',
    ')',
    '-',
    '+',
    ' ',
  ];
  if (!allowedKeys.includes(e.key) && !/\d/.test(e.key)) {
    e.preventDefault();
  }
};
