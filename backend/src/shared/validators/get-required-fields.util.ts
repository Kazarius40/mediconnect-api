import 'reflect-metadata';
import { getMetadataStorage } from 'class-validator';

export function getRequiredFields<T extends object>(
  target: new () => T,
): (keyof T)[] {
  const metadata = getMetadataStorage().getTargetValidationMetadatas(
    target,
    '',
    true,
    false,
  );

  return metadata
    .filter((meta) => meta.type === 'isDefined' || meta.type === 'isNotEmpty')
    .map((meta) => meta.propertyName as keyof T);
}
