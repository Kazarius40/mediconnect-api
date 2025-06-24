import { FindOptionsWhere, In, ObjectLiteral, Repository } from 'typeorm';

export async function resolveRelations<
  T extends ObjectLiteral & { id: number },
>(repo: Repository<T>, ids: number[] | undefined): Promise<T[] | undefined> {
  if (ids === undefined) return undefined;
  return ids.length
    ? await repo.findBy({ id: In(ids) } as FindOptionsWhere<T>)
    : [];
}
