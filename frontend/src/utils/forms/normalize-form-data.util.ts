export function cleanOptionalFields<T extends object, K extends keyof T>(
  data: T,
  fields: K[],
): T {
  const copy = { ...data };

  fields.forEach((field) => {
    const value = copy[field];
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      delete copy[field];
    }
  });

  return copy;
}
