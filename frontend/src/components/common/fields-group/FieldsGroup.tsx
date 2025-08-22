'use client';

import { useFormContext, FieldError, RegisterOptions } from 'react-hook-form';

import './style.css';

type FieldName =
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'email'
  | 'name'
  | 'address'
  | 'description';

interface FieldsGroupProps {
  fields: FieldName[];
  requiredFields?: FieldName[];
}

const baseValidationRules: Record<FieldName, RegisterOptions> = {
  firstName: {
    minLength: { value: 2, message: 'Must be at least 2 characters' },
  },
  lastName: {
    minLength: { value: 2, message: 'Must be at least 2 characters' },
  },
  phone: {
    validate: (v: string) =>
      !v || /^\+380\d{9}$/.test(v) || 'Phone must be +380XXXXXXXXX',
  },
  email: {
    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
  },
  name: {
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
  },
  address: {},
  description: {},
};

const labels: Record<FieldName, string> = {
  firstName: 'First Name',
  lastName: 'Last Name',
  phone: 'Phone',
  email: 'Email',
  name: 'Name',
  address: 'Address',
  description: 'Description',
};

export function FieldsGroup({ fields, requiredFields = [] }: FieldsGroupProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      {fields.map((field) => {
        const isRequired = requiredFields.includes(field);
        const rules: RegisterOptions = {
          ...baseValidationRules[field],
          ...(isRequired ? { required: labels[field] + ' is required' } : {}),
        };
        const error = errors[field] as FieldError | undefined;

        return (
          <div key={field} className="fields-group-field">
            <label htmlFor={field} className="fields-group-label">
              {labels[field]} {isRequired && '*'}
            </label>
            <input
              id={field}
              type="text"
              {...register(field, rules)}
              className={
                error ? 'fields-group-input-error' : 'fields-group-input'
              }
            />
            {error && <p className="fields-group-error">{error.message}</p>}
          </div>
        );
      })}
    </>
  );
}
