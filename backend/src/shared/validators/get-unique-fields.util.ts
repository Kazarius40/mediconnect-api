import { getMetadataArgsStorage } from 'typeorm';

export function getUniqueFieldsFromEntity<T>(
  entity: new (...args: unknown[]) => T,
): string[] {
  return getMetadataArgsStorage()
    .columns.filter((col) => col.target === entity && col.options?.unique)
    .map((col) => col.propertyName);
}
