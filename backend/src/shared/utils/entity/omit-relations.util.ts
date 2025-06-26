export function omitRelations<T extends object, K extends keyof T>(
  dto: T,
  relationKeys: K[],
): Omit<T, K> {
  const clone = { ...dto };
  for (const key of relationKeys) {
    delete clone[key];
  }
  return clone;
}
