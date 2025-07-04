import { FindOptionsWhere, In, ObjectLiteral, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

/**
 * Resolves relation IDs to entity instances using repository.
 * Returns undefined if ids undefined, empty array if no ids.
 */
export async function resolveRelations<
  T extends ObjectLiteral & { id: number },
>(repo: Repository<T>, ids: number[] | undefined): Promise<T[] | undefined> {
  if (ids === undefined) return undefined;
  if (ids.length === 0) return [];

  const entities = await repo.findBy({ id: In(ids) } as FindOptionsWhere<T>);
  const foundIds = entities.map((e) => e.id);

  const missingIds = ids.filter((id) => !foundIds.includes(id));
  if (missingIds.length > 0) {
    throw new BadRequestException(
      `Related entities not found for IDs: ${missingIds.join(', ')}`,
    );
  }

  return entities;
}
