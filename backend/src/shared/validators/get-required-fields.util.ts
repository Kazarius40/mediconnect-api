import 'reflect-metadata';
import { getMetadataStorage } from 'class-validator';
import { RELATION_PROPS_KEY } from '../utils/decorators/relation-property.decorator';

export function getFilteredFields<T extends object>(
  target: new () => T,
  includeOptional = false,
): (keyof T)[] {
  const relationProps =
    (Reflect.getMetadata(RELATION_PROPS_KEY, target) as string[] | undefined) ??
    [];

  const metadata = getMetadataStorage().getTargetValidationMetadatas(
    target,
    '',
    true,
    false,
  );

  const uniqueFields = new Set<string>();

  for (const meta of metadata) {
    if (relationProps.includes(meta.propertyName)) {
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
