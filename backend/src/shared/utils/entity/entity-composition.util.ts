import { ObjectLiteral, Repository } from 'typeorm';
import { omitRelations } from './omit-relations.util';
import { resolveRelations } from './resolve-relations.util';
import { applyDtoToEntity } from './apply-dto-to-entity.util';

type EntityClass<T> = new (...args: never[]) => T;

export type BaseEntity = ObjectLiteral & { id: number };

export type RepositoriesMap<TDto extends object> = {
  [K in keyof TDto]?: Repository<BaseEntity>;
};

export function buildReposMap<
  TDto extends object,
  TEntities extends EntityClass<BaseEntity>[],
>(
  relationEntityClasses: readonly [...TEntities],
  injectedRepositories: Record<string, Repository<BaseEntity>>,
): RepositoriesMap<TDto> {
  const reposMap: Partial<RepositoriesMap<TDto>> = {};

  for (const entityClass of relationEntityClasses) {
    const name = entityClass.name;
    const singularKey = name.charAt(0).toLowerCase() + name.slice(1);
    const pluralKey = `${singularKey}s`;
    const repositoryKey = `${singularKey}Repository`;

    const repository = injectedRepositories[repositoryKey];
    if (!repository) {
      throw new Error(
        `Repository for entity ${name} (expected key: ${repositoryKey}) not found or invalid in injectedRepositories.`,
      );
    }

    reposMap[pluralKey as keyof TDto] = repository;
  }

  return reposMap as RepositoriesMap<TDto>;
}

export function cleanDto<T extends object, K extends keyof T>(
  dto: T,
  relationKeys: readonly K[],
): Omit<T, K> {
  return omitRelations(dto, relationKeys);
}

export async function setEntityRelations<
  TEntity extends BaseEntity,
  TDto extends object,
  K extends keyof TDto & string,
>(
  entity: TEntity,
  dto: TDto,
  relationKeys: K[],
  reposByKey: RepositoriesMap<TDto>,
  mode: 'put' | 'patch' = 'patch',
): Promise<void> {
  for (const relation of relationKeys) {
    const repository = reposByKey[relation];
    const relationIds = dto[relation];

    if (repository && Array.isArray(relationIds)) {
      const resolved = await resolveRelations(repository, relationIds);
      if (relation in entity) {
        (entity as Record<K, typeof resolved>)[relation] = resolved ?? [];
      }
    } else if (mode === 'put') {
      if (relation in entity) {
        (entity as Record<K, unknown[]>)[relation] = [];
      }
    }
  }
}

export async function compose<
  TEntity extends BaseEntity,
  TDto extends object,
  K extends keyof TDto & string,
>(
  entityClass: EntityClass<TEntity>,
  dto: TDto,
  relationKeys: K[],
  reposByKey: RepositoriesMap<TDto>,
  existingEntity?: TEntity,
): Promise<TEntity> {
  const entity = existingEntity || new entityClass();

  applyDtoToEntity(entity, dto);

  await setEntityRelations(entity, dto, relationKeys, reposByKey);

  return entity;
}
