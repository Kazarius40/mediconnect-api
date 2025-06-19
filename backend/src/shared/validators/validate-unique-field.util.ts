import { FindOptionsWhere, Not, ObjectLiteral, Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';

export async function validateUniqueness<T extends ObjectLiteral>(
  repository: Repository<T>,
  fields: Partial<Record<keyof T, string | number | null | undefined>>,
  currentId?: number,
): Promise<void> {
  const whereConditions: FindOptionsWhere<T>[] = [];

  for (const [field, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;

    const condition = {
      [field]: value,
      ...(currentId !== undefined ? { id: Not(currentId) } : {}),
    } as FindOptionsWhere<T>;

    whereConditions.push(condition);
  }

  if (whereConditions.length === 0) return;

  const existing = await repository.findOne({ where: whereConditions });

  if (existing) {
    for (const field in fields) {
      const value = fields[field];
      if (value && existing[field] === value) {
        throw new ConflictException(
          `${repository.metadata.name} with ${field} '${value}' already exists.`,
        );
      }
    }
  }
}
