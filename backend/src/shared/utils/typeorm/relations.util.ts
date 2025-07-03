import { ObjectLiteral, Repository } from 'typeorm';

/**
 * Returns all first-level and optional nested relations of entity repository.
 * Useful for dynamic relation loading in queries.
 */
export function getRelations<Entity extends ObjectLiteral>(
  repo: Repository<Entity>,
  nestedRelations: string[] = [],
): string[] {
  const firstLevel = repo.metadata.relations.map((rel) => rel.propertyPath);
  return [...firstLevel, ...nestedRelations];
}
