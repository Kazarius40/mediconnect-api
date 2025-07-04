type UpdateMode = 'patch' | 'put';

/**
 * Updates scalar fields of entity based on DTO values.
 * In 'put' mode sets absent scalar fields (not preserved) to null.
 */
export function updateEntityFields<T extends object>(
  entity: T,
  dto: Partial<T>,
  mode: UpdateMode = 'patch',
): T {
  const typeOrmManagedFields = ['id', 'createdAt', 'updatedAt'] as (keyof T)[];

  for (const key of Object.keys(entity) as (keyof T)[]) {
    if (typeOrmManagedFields.includes(key)) {
      continue;
    }

    const dtoValue = dto[key];

    if (dtoValue !== undefined) {
      entity[key] = dtoValue;
    } else if (mode === 'put') {
      const currentVal = entity[key];
      const isRelational =
        Array.isArray(currentVal) || typeof currentVal === 'object';

      if (!isRelational) {
        entity[key] = null as T[keyof T];
      }
    }
  }

  return entity;
}
