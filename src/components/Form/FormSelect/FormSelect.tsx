import { useFormContext, useFormState } from "react-hook-form";
import type { SelectHTMLAttributes } from "react";
import styles from "../FormInput/FormInput.module.css";

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: Option[];
}

export function FormSelect({
  name,
  options,
  className = "",
  ...rest
}: FormSelectProps) {
  const { register, control } = useFormContext();
  const { errors } = useFormState({ control, name });
  const error = errors[name];

  return (
    <>
      <select
        {...register(name)}
        className={`${styles.formInput} ${
          error ? styles.selectError : ""
        } ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error?.message && (
        <span className={styles.formError}>{String(error.message)}</span>
      )}
    </>
  );
}
