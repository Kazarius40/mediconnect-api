type UpdateMode = 'patch' | 'put';

export function updateEntityFields<T extends object>(
  entity: T,
  dto: Partial<T>,
  mode: UpdateMode = 'patch',
  requiredFields: (keyof T)[] = [],
): T {
  for (const key of Object.keys(entity) as (keyof T)[]) {
    const dtoValue = dto[key];

    if (dtoValue !== undefined) {
      entity[key] = dtoValue;
    } else if (mode === 'put' && !requiredFields.includes(key)) {
      entity[key] = null as unknown as T[keyof T];
    }
  }

  return entity;
}
