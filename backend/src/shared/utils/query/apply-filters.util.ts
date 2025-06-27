import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export function applyFilters<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  filter: Partial<
    Record<keyof T | 'sortBy' | 'sortOrder', string | number | boolean>
  >,
  alias: string,
  relationKeys?: string[],
): void {
  const excludedKeys = ['sortBy', 'sortOrder'];

  Object.entries(filter).forEach(([key, value]) => {
    if (value === undefined || value === null || excludedKeys.includes(key)) {
      return;
    }

    if (
      relationKeys &&
      key.endsWith('Ids') &&
      Array.isArray(value) &&
      value.length > 0
    ) {
      const relationName = key.slice(0, -3);
      if (relationKeys.includes(relationName)) {
        const joinAlias = `filter_${relationName}`;
        query.leftJoin(`${alias}.${relationName}`, joinAlias);
        query.andWhere(`${joinAlias}.id IN (:...${key})`, { [key]: value });
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
