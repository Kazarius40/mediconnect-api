type UpdateMode = 'patch' | 'put';

export function updateEntityFields<T extends object>(
  entity: T,
  dto: Partial<T>,
  mode: UpdateMode = 'patch',
  preservedFields: (keyof T)[] = [],
): T {
  const typeOrmManagedFields = ['id', 'createdAt', 'updatedAt'] as (keyof T)[];

  for (const key of Object.keys(entity) as (keyof T)[]) {
    if (typeOrmManagedFields.includes(key)) {
      continue;
    }

    const dtoValue = dto[key];

    if (dtoValue !== undefined) {
      entity[key] = dtoValue;
    } else if (mode === 'put' && !preservedFields.includes(key)) {
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
