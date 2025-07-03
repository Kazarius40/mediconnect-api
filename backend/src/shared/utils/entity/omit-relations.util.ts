/**
 * Omits relational properties from DTO by relationKeys.
 * Returns a new object without specified keys.
 */
export function omitRelations<T extends object, K extends keyof T>(
  dto: T,
  relationKeys: readonly K[],
): Omit<T, K> {
  const clone = { ...dto };
  for (const key of relationKeys) {
    delete clone[key];
  }
  return clone;
}
