import { ObjectLiteral, Repository } from 'typeorm';
import { omitRelations } from './omit-relations.util';
import { getRequiredFields } from '../../validators/get-required-fields.util';
import { resolveRelations } from './resolve-relations.util';
import { applyDtoToEntity } from './apply-dto-to-entity.util';

type EntityClass<T> = new (...args: never[]) => T;

export type BaseEntity = ObjectLiteral & { id: number };

export type RepositoriesMap<TDto extends Record<string, unknown>> = {
  [K in keyof TDto]?: Repository<BaseEntity>;
};

export function buildRelationRepositoriesMap<
  TDto extends Record<string, unknown>,
  TEntities extends EntityClass<BaseEntity>[],
>(
  relationEntityClasses: readonly [...TEntities],
  injectedRepositories: Record<string, Repository<BaseEntity>>,
): RepositoriesMap<TDto> {
  const reposMap: Partial<RepositoriesMap<TDto>> = {};

  for (const entityClass of relationEntityClasses) {
    const name = entityClass.name;
    const key = name.charAt(0).toLowerCase() + name.slice(1);
    const repositoryKey = `${key}Repository`;

    const repository = injectedRepositories[repositoryKey];
    if (!repository) {
      throw new Error(
        `Repository for entity ${name} (expected key: ${repositoryKey}) not found or invalid in injectedRepositories.`,
      );
    }

    reposMap[key as keyof TDto] = repository;
  }

  return reposMap as RepositoriesMap<TDto>;
}

export function getDtoWithoutRelations<
  T extends Record<string, unknown>,
  K extends keyof T,
>(dto: T, relationKeys: K[]): Omit<T, K> {
  return omitRelations(dto, relationKeys);
}

export function getRequiredScalarFields<
  T extends Record<string, unknown>,
  K extends keyof T,
>(dtoClass: EntityClass<T>, relationKeys: K[]): (keyof T)[] {
  return getRequiredFields(dtoClass).filter(
    (field) => !(relationKeys as string[]).includes(field as string),
  );
}

export async function setEntityRelations<
  TEntity extends BaseEntity,
  TDTO extends Record<string, unknown>,
  K extends keyof TDTO,
>(
  entity: TEntity,
  dto: TDTO,
  relationKeys: K[],
  reposByKey: RepositoriesMap<TDTO>,
): Promise<void> {
  for (const relationName of relationKeys) {
    const repository = reposByKey[relationName];
    const relationIds = dto[relationName];

    if (repository && Array.isArray(relationIds)) {
      const resolved = await resolveRelations(repository, relationIds);
      (entity as Record<string, unknown>)[relationName as string] =
        resolved ?? [];
    }
  }
}

export async function composeEntity<
  TEntity extends BaseEntity,
  TDTO extends Record<string, unknown>,
  K extends keyof TDTO,
>(
  entityClass: EntityClass<TEntity>,
  dto: TDTO,
  relationKeys: K[],
  reposByKey: RepositoriesMap<TDTO>,
  existingEntity?: TEntity,
): Promise<TEntity> {
  const entity = existingEntity || new entityClass();

  applyDtoToEntity(
    entity,
    getDtoWithoutRelations(dto, relationKeys) as unknown as Partial<TEntity>,
  );

  await setEntityRelations(entity, dto, relationKeys, reposByKey);

  return entity;
}
