import { getMetadataStorage } from 'class-validator';

export function getFilteredFields<T extends object>(
  target: new () => T,
  relationKeys: (keyof T)[] = [],
  includeOptional = false,
): (keyof T)[] {
  const metadata = getMetadataStorage().getTargetValidationMetadatas(
    target,
    '',
    true,
    false,
  );

  const uniqueFields = new Set<string>();

  for (const meta of metadata) {
    if (relationKeys.includes(meta.propertyName as keyof T)) {
      continue;
    }

    const isRequiredValidator =
      meta.type === 'isDefined' || meta.type === 'isNotEmpty';

    const isOptionalValidator = meta.type === 'isOptional';

    if (isRequiredValidator) {
      uniqueFields.add(meta.propertyName);
    } else if (includeOptional && isOptionalValidator) {
      uniqueFields.add(meta.propertyName);
    } else if (includeOptional && !isOptionalValidator) {
      uniqueFields.add(meta.propertyName);
    }
  }

  return Array.from(uniqueFields) as (keyof T)[];
}
