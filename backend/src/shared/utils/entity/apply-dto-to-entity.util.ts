/**
 * Applies scalar fields from DTO to entity.
 * Skips fields in the exclude list.
 */
export function applyDtoToEntity<T extends object>(
  entity: T,
  dto: Partial<T>,
  { exclude = [] }: { exclude?: (keyof T)[] } = {},
): T {
  for (const key of Object.keys(dto) as (keyof T)[]) {
    if (exclude.includes(key)) continue;

    const value = dto[key];
    if (value === undefined) continue;

    if (typeof (value as unknown) === 'string') {
      const trimmed = (value as string).trim();
      entity[key] = (trimmed === '' ? null : trimmed) as T[keyof T];
    } else {
      entity[key] = value as T[keyof T];
    }
  }
  return entity;
}
