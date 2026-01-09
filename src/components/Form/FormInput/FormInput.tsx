import { useFormContext, useFormState } from "react-hook-form";
import type { InputHTMLAttributes } from "react";
import styles from "./FormInput.module.css";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function FormInput({ name, className = "", ...rest }: FormInputProps) {
  const { register, control } = useFormContext();
  const { errors } = useFormState({ control, name });
  const error = errors[name];

  return (
    <div className={styles.inputWrapper}>
      <input
        {...register(name)}
        className={`${styles.formInput} ${
          error ? styles.inputError : ""
        } ${className}`}
        {...rest}
      />
      {error?.message && (
        <span className={styles.formError}>{String(error.message)}</span>
      )}
    </div>
  );
}
