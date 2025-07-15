'use client';

import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  type = 'text',
  register,
  error,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="block font-semibold mb-1">
        {label} {required && '*'}
      </label>
      <input
        id={htmlFor}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full border p-2 rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
    </div>
  );
};
