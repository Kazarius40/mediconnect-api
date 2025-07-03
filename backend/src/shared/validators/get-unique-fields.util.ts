import { getMetadataArgsStorage } from 'typeorm';

/**
 * Extracts fields with unique constraint from entity metadata.
 * Used for uniqueness validation of DTOs.
 */
export function getUniqueFieldsFromEntity<T>(
  entity: new (...args: unknown[]) => T,
): string[] {
  return getMetadataArgsStorage()
    .columns.filter((col) => col.target === entity && col.options?.unique)
    .map((col) => col.propertyName);
}
