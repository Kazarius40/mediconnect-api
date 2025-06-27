import 'reflect-metadata';

export const RELATION_PROPS_KEY = Symbol('relation_props');

export function RelationProperty(): PropertyDecorator {
  // target => CreateDoctorDto.prototype
  // propertyKey => 'clinics', 'services', etc.
  return (target, propertyKey) => {
    // existing = undefined => ['clinics'] => ['clinics', 'services'] ...
    const existing = Reflect.getMetadata(
      RELATION_PROPS_KEY,
      // target.constructor => CreateDoctorDto or CreateClinicDto, etc.
      target.constructor,
    ) as string[] | undefined;

    const updated = [...new Set([...(existing || []), propertyKey.toString()])];

    Reflect.defineMetadata(RELATION_PROPS_KEY, updated, target.constructor);
  };
}

export function getRelationProperties<T extends object>(
  dtoClass: new () => T,
): (keyof T)[] {
  // dtoClass — constructor of CreateDoctorDto, CreateClinicDto, etc.
  const keys = Reflect.getMetadata(RELATION_PROPS_KEY, dtoClass) as
    | string[]
    | undefined;

  return (keys || []) as (keyof T)[];
}
