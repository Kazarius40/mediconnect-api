import { ObjectLiteral, Repository } from 'typeorm';
import { omitRelations } from './omit-relations.util';
import { resolveRelations } from './resolve-relations.util';
import { applyDtoToEntity } from './apply-dto-to-entity.util';
import { relationAliasMap } from './relation-alias-map.util';

type EntityClass<T> = new (...args: never[]) => T;

export type BaseEntity = ObjectLiteral & { id: number };

export type RepositoriesMap<TDto extends object> = {
  [K in keyof TDto]?: Repository<BaseEntity>;
};

/**
 * Builds a map of relation DTO keys to their respective repositories.
 * Used for setting relations dynamically by DTO property name.
 */
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

    const dtoKey = relationAliasMap[pluralKey] ?? pluralKey;
    reposMap[dtoKey as keyof TDto] = repository;
  }

  return reposMap as RepositoriesMap<TDto>;
}

/**
 * Cleans DTO by removing relational properties, leaving only scalar fields.
 * Useful before applying uniqueness validation or saving entities.
 */
export function cleanDto<T extends object, K extends keyof T>(
  dto: T,
  relationKeys: readonly K[],
): Omit<T, K> {
  const aliasKeys = relationKeys.map(
    (key) => (relationAliasMap[key as string] ?? key) as K,
  );

  return omitRelations(dto, aliasKeys);
}

/**
 * Sets relations for entity based on provided DTO and mode (put/patch).
 * Replaces or clears relations depending on update mode.
 */
export async function setEntityRelations<
  TEntity extends BaseEntity,
  TDto extends object,
  K extends keyof TDto & string,
>(
  entity: TEntity,
  dto: TDto,
  relationKeys: K[],
  reposByKey: RepositoriesMap<TDto>,
): Promise<void> {
  for (const relation of relationKeys) {
    const repository = reposByKey[relation];
    const dtoKey =
      Object.entries(relationAliasMap).find(
        ([, entityKey]) => entityKey === relation,
      )?.[0] ?? relation;

    const relationIds = dto[dtoKey as keyof TDto] as number[] | undefined;

    if (repository && Array.isArray(relationIds)) {
      const resolved = await resolveRelations(repository, relationIds);
      if (relation in entity) {
        (entity as Record<K, typeof resolved>)[relation] = resolved ?? [];
      }
    }
  }
}

/**
 * Composes entity from DTO and related entities by:
 * - Applying scalar fields.
 * - Resolving and assigning relations.
 * Supports creating new or updating existing entity.
 */
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
