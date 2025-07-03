import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/**
 * Applies filtering to query builder based on filter DTO.
 * Supports:
 * - scalar filters
 * - relationIds-based filters
 * - nested filters via nestedFilterMap
 * - sortBy / sortOrder
 */
export function applyFilters<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  filter: Partial<
    Record<keyof T | 'sortBy' | 'sortOrder', string | number | boolean>
  >,
  alias: string,
  relationKeys?: string[],
  nestedFilterMap?: Record<string, string>,
): void {
  const excludedKeys = ['sortBy', 'sortOrder'];

  let joinCounter = 0;
  function joinRelation(
    query: SelectQueryBuilder<T>,
    baseAlias: string,
    relation: string,
  ) {
    const joinAlias = `${baseAlias}_${relation}_${joinCounter++}`;
    query.leftJoin(`${baseAlias}.${relation}`, joinAlias);
    return joinAlias;
  }

  Object.entries(filter).forEach(([key, value]) => {
    if (value === undefined || value === null || excludedKeys.includes(key)) {
      return;
    }

    if (
      nestedFilterMap &&
      nestedFilterMap[key] &&
      Array.isArray(value) &&
      value.length > 0
    ) {
      const nestedAlias = nestedFilterMap[key];
      query.andWhere(`${nestedAlias}.id IN (:...${key})`, { [key]: value });
      return;
    }

    if (
      relationKeys &&
      key.endsWith('Ids') &&
      Array.isArray(value) &&
      value.length > 0
    ) {
      const baseRelationName = key.slice(0, -3) + 's';

      const matchedRelations = relationKeys.filter(
        (r) => r === baseRelationName && !r.includes('.'),
      );

      if (matchedRelations.length > 0) {
        matchedRelations.forEach((relation) => {
          const joinAlias = joinRelation(query, alias, relation);
          query.andWhere(`${joinAlias}.id IN (:...${key})`, { [key]: value });
        });
        return;
      }
    }

    if (typeof value === 'string') {
      query.andWhere(`LOWER(${alias}.${key}) LIKE LOWER(:${key})`, {
        [key]: `%${value}%`,
      });
    } else {
      query.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
    }
  });

  const sortBy = filter.sortBy;
  const sortOrder = filter.sortOrder === 'DESC' ? 'DESC' : 'ASC';

  if (sortBy && typeof sortBy === 'string') {
    query.orderBy(`${alias}.${sortBy}`, sortOrder);
  } else {
    query.orderBy(`${alias}.id`, 'ASC');
  }
}
