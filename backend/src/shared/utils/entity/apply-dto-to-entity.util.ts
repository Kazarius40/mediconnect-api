/**
 * Applies scalar fields from DTO to entity.
 * Skips fields in the exclude list.
 */
export function applyDtoToEntity<T extends object>(
  entity: T,
  dto: Partial<T>,
  options: {
    exclude?: (keyof T)[];
  } = {},
): T {
  const { exclude = [] } = options;

  (Object.keys(dto) as (keyof T)[]).forEach((key) => {
    let value = dto[key];

    if (value === '') {
      value = null as unknown as T[keyof T];
    }

    if (value !== undefined && !exclude.includes(key)) {
      entity[key] = value;
    }
  });

  return entity;
}
