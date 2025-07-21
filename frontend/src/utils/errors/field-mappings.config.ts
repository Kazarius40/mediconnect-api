export const fieldMappings = [
  { pattern: /phone/i, field: 'phone' },
  { pattern: /email/i, field: 'email' },
  { pattern: /^(?!.*first)(?!.*last).*name$/i, field: 'name' },
  { pattern: /first/i, field: 'firstName' },
  { pattern: /last/i, field: 'lastName' },
  { pattern: /address/i, field: 'address' },
];
