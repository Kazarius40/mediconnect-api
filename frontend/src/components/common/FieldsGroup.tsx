'use client';

import React from 'react';
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  Path,
  FieldError,
} from 'react-hook-form';
import { FormField } from '@/components/common/FormField';

type FieldName =
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'email'
  | 'name'
  | 'address'
  | 'description';

interface FieldsGroupProps<TFormValues extends FieldValues> {
  fields: FieldName[];
  registerAction: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
}

export function FieldsGroup<TFormValues extends FieldValues>({
  fields,
  registerAction,
  errors,
}: FieldsGroupProps<TFormValues>) {
  return (
    <>
      {fields.map((field) => {
        let fieldProps: Parameters<typeof FormField>[0];

        switch (field) {
          case 'firstName':
            fieldProps = {
              label: 'First Name',
              htmlFor: 'firstName',
              required: true,
              register: registerAction('firstName' as Path<TFormValues>, {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'Must be at least 2 characters',
                },
              }),
              error: errors['firstName'] as FieldError | undefined,
            };
            break;
          case 'lastName':
            fieldProps = {
              label: 'Last Name',
              htmlFor: 'lastName',
              required: true,
              register: registerAction('lastName' as Path<TFormValues>, {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Must be at least 2 characters',
                },
              }),
              error: errors['lastName'] as FieldError | undefined,
            };
            break;
          case 'phone':
            fieldProps = {
              label: 'Phone',
              htmlFor: 'phone',
              required: false,
              register: registerAction('phone' as Path<TFormValues>, {
                validate: (v) =>
                  !v ||
                  /^\+380\d{9}$/.test(v) ||
                  'Phone number must be in +380XXXXXXXXX format',
              }),
              error: errors['phone'] as FieldError | undefined,
            };
            break;
          case 'email':
            fieldProps = {
              label: 'Email',
              htmlFor: 'email',
              required: false,
              type: 'email',
              register: registerAction('email' as Path<TFormValues>, {
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email address',
                },
              }),
              error: errors['email'] as FieldError | undefined,
            };
            break;
          case 'name':
            fieldProps = {
              label: 'Name',
              htmlFor: 'name',
              required: true,
              register: registerAction('name' as Path<TFormValues>, {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }),
              error: errors['name'] as FieldError | undefined,
            };
            break;
          case 'address':
            fieldProps = {
              label: 'Address',
              htmlFor: 'address',
              required: true,
              register: registerAction('address' as Path<TFormValues>, {
                required: 'Address is required',
              }),
              error: errors['address'] as FieldError | undefined,
            };
            break;
          case 'description':
            fieldProps = {
              label: 'Description',
              htmlFor: 'description',
              required: false,
              register: registerAction('description' as Path<TFormValues>),
              error: errors['description'] as FieldError | undefined,
            };
            break;
          default:
            return null;
        }

        return <FormField key={field} {...fieldProps} />;
      })}
    </>
  );
}
