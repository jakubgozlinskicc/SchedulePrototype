import { useFormContext, useFormState, Controller } from "react-hook-form";
import type { ComponentProps } from "react";
import styles from "../../DatePicker/DatePicker.module.css";
import { DatePicker } from "../../DatePicker/DatePicker";

interface FormDatePickerProps
  extends Omit<
    ComponentProps<typeof DatePicker>,
    "value" | "onChange" | "error"
  > {
  name: string;
}

export function FormDatePicker({
  name,
  variant = "date",
  ...props
}: FormDatePickerProps) {
  const { control } = useFormContext();
  const { errors } = useFormState({ control, name });
  const error = errors[name];

  return (
    <div className={styles.field}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            value={value ? new Date(value) : null}
            onChange={onChange}
            variant={variant}
            error={!!error}
            {...props}
          />
        )}
      />
      {error?.message && (
        <span className={styles.errorMessage}>{String(error.message)}</span>
      )}
    </div>
  );
}
