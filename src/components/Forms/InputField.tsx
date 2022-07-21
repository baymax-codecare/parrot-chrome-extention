import { UseFormRegisterReturn } from 'react-hook-form';

import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type InputFieldProps = FieldWrapperPassThroughProps & {
  type?: 'text' | 'email' | 'password' | 'checkbox';
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
  placeholder?: string;
  isRequired?: boolean;
};

export const InputField = (props: InputFieldProps) => {
  const {
    type = 'text',
    isRequired = false,
    label,
    className,
    registration,
    error,
    placeholder,
    ...rest
  } = props;
  return (
    <FieldWrapper isRequired={isRequired} label={label} error={error} {...rest}>
      <input
        type={type}
        className={className}
        {...registration}
        placeholder={placeholder ? placeholder : ''}
      />
    </FieldWrapper>
  );
};
