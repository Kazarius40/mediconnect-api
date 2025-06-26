export function applyDtoToEntity<T extends object>(
  entity: T,
  dto: Partial<T>,
  options: {
    exclude?: (keyof T)[];
  } = {},
): T {
  const { exclude = [] } = options;

  (Object.keys(dto) as (keyof T)[]).forEach((key) => {
    const value = dto[key];
    if (value !== undefined && !exclude.includes(key)) {
      entity[key] = value;
    }
  });

  return entity;
}
