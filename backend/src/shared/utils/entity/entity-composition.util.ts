import { ObjectLiteral, Repository } from 'typeorm';
import { omitRelations } from './omit-relations.util';
import { getFilteredFields } from '../../validators/get-required-fields.util';
import { resolveRelations } from './resolve-relations.util';
import { applyDtoToEntity } from './apply-dto-to-entity.util';

type EntityClass<T> = new (...args: never[]) => T;

export type BaseEntity = ObjectLiteral & { id: number };

export type RepositoriesMap<TDto extends Record<string, unknown>> = {
  [K in keyof TDto]?: Repository<BaseEntity>;
};

export function buildReposMap<
  TDto extends Record<string, unknown>,
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

export function cleanDto<T extends Record<string, unknown>, K extends keyof T>(
  dto: T,
  relationKeys: K[],
): Omit<T, K> {
  return omitRelations(dto, relationKeys);
}

export function getRequiredScalarFields<
  T extends Record<string, unknown>,
  K extends keyof T,
>(dtoClass: EntityClass<T>, relationKeys: K[]): (keyof T)[] {
  return getFilteredFields(dtoClass).filter(
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
  mode: 'put' | 'patch' = 'patch',
): Promise<void> {
  for (const relation of relationKeys) {
    const repository = reposByKey[relation];
    const relationIds = dto[relation];

    if (repository && Array.isArray(relationIds)) {
      const resolved = await resolveRelations(repository, relationIds);
      (entity as Record<string, unknown>)[relation as string] = resolved ?? [];
    } else if (mode === 'put') {
      (entity as Record<string, unknown>)[relation as string] = [];
    }
  }
}

export async function compose<
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
    cleanDto(dto, relationKeys) as unknown as Partial<TEntity>,
  );

  await setEntityRelations(entity, dto, relationKeys, reposByKey);

  return entity;
}
