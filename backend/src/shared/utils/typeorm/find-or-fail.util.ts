import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export async function findOrFail<T extends { id: number }>(
  repository: Repository<T>,
  id: number,
  options?: Omit<FindOneOptions<T>, 'where'>,
): Promise<T> {
  const entity = await repository.findOne({
    where: { id } as FindOptionsWhere<T>,
    ...options,
  });

  if (!entity) {
    const entityName = repository.metadata.name || 'Entity';
    throw new NotFoundException(`${entityName} with ID ${id} not found.`);
  }

  return entity;
}
