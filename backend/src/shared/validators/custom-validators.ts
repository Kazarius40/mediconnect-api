import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
        },
        defaultMessage() {
          return 'Password must contain at least one uppercase letter and one number and be at least 6 characters long';
        },
      },
    });
  };
}

export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidName',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          return /^[A-Za-zА-Яа-яЇїІіЄєҐґ\s-]*$/.test(value);
        },
        defaultMessage() {
          return 'Name must contain only letters, spaces, and hyphens';
        },
      },
    });
  };
}

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPhone',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value === null || value === undefined || value === '')
            return true;
          if (typeof value !== 'string') return false;
          return /^\+380\d{9}$/.test(value);
        },
        defaultMessage() {
          return 'Phone number must be valid';
        },
      },
    });
  };
}
