import clsx from 'clsx';
import * as React from 'react';
import { FieldError } from 'react-hook-form';

type FieldWrapperProps = {
  label?: string;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
  error?: FieldError | undefined;
  description?: string;
  prefixIcon?: React.ReactNode;
  isRequired?: boolean;
};

export type FieldWrapperPassThroughProps = Omit<FieldWrapperProps, 'className' | 'children'>;

export const FieldWrapper = (props: FieldWrapperProps) => {
  const { label, prefixIcon, error, children, labelClassName, isRequired = false } = props;
  return (
    <div>
      {label ? (
        <label className={clsx('block text-sm font-semibold text-teal-800', labelClassName)}>
          &nbsp;{label}
          {isRequired && <span className="text-red-800"> *</span>}
          <div className="mt-1 relative rounded-md shadow-sm">
            {prefixIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {prefixIcon}
              </div>
            )}
            {children}
          </div>
        </label>
      ) : (
        <div> {children}</div>
      )}

      {error?.message && (
        <div
          role="alert"
          aria-label={error.message}
          className="text-sm font-semibold text-red-500 mt-1"
        >
          {error.message}
        </div>
      )}
    </div>
  );
};
