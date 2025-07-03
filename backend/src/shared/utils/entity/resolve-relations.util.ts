import { FindOptionsWhere, In, ObjectLiteral, Repository } from 'typeorm';

/**
 * Resolves relation IDs to entity instances using repository.
 * Returns undefined if ids undefined, empty array if no ids.
 */
export async function resolveRelations<
  T extends ObjectLiteral & { id: number },
>(repo: Repository<T>, ids: number[] | undefined): Promise<T[] | undefined> {
  if (ids === undefined) return undefined;
  return ids.length
    ? await repo.findBy({ id: In(ids) } as FindOptionsWhere<T>)
    : [];
}
