import { Not, Repository, FindOptionsWhere } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { getUniqueFieldsFromEntity } from './get-unique-fields.util';

type ScalarFieldsOf<T> = {
  [K in keyof T as T[K] extends object ? never : K]?: T[K];
};

export async function validateEntityUniqueness<T extends object>(
  repository: Repository<T>,
  dto: ScalarFieldsOf<Partial<T>>,
  currentId?: number,
): Promise<void> {
  const entityConstructor = repository.target as new (...args: unknown[]) => T;

  const uniqueFields = getUniqueFieldsFromEntity(entityConstructor);

  const fieldsToCheck = Object.fromEntries(
    uniqueFields
      .filter((field) => {
        const value = dto[field as keyof typeof dto];
        return value !== undefined && value !== null;
      })
      .map((field) => [field, dto[field as keyof typeof dto]]),
  ) as Partial<T>;

  if (Object.keys(fieldsToCheck).length === 0) return;

  const whereConditions: FindOptionsWhere<T>[] = Object.entries(
    fieldsToCheck,
  ).map(
    ([field, value]) =>
      ({
        [field]: value,
        ...(currentId !== undefined ? { id: Not(currentId) } : {}),
      }) as FindOptionsWhere<T>,
  );

  const existing = await repository.findOne({ where: whereConditions });

  if (existing) {
    for (const [field, value] of Object.entries(fieldsToCheck)) {
      const key = field as keyof T;
      if (existing[key] === value) {
        throw new ConflictException(
          `${repository.metadata.name} with ${String(field)} '${String(value)}' already exists.`,
        );
      }
    }
  }
}
