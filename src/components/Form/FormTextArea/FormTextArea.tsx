import { useFormContext, useFormState } from "react-hook-form";
import type { TextareaHTMLAttributes } from "react";
import styles from "./FormTextArea.module.css";

interface FormTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export function FormTextArea({
  name,
  className = "",
  ...rest
}: FormTextAreaProps) {
  const { register, control } = useFormContext();
  const { errors } = useFormState({ control, name });
  const error = errors[name];

  return (
    <>
      <textarea
        {...register(name)}
        className={`${styles.formTextArea} ${
          error ? styles.textareaError : ""
        } ${className}`}
        {...rest}
      />
      {error?.message && (
        <span className={styles.formError}>{String(error.message)}</span>
      )}
    </>
  );
}
