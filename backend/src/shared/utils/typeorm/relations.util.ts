import { ObjectLiteral, Repository } from 'typeorm';

export function getRelations<Entity extends ObjectLiteral>(
  repo: Repository<Entity>,
  nestedRelations: string[] = [],
): string[] {
  const firstLevel = repo.metadata.relations.map((rel) => rel.propertyPath);
  return [...firstLevel, ...nestedRelations];
}
