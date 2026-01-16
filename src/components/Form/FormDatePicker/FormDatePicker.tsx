import { useFormContext, useFormState, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./FormDatePicker.module.css";

interface FormDatePickerProps {
  name: string;
  showTimeSelect?: boolean;
  dateFormat?: string;
  placeholderText?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function FormDatePicker({
  name,
  showTimeSelect = false,
  dateFormat = showTimeSelect ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy",
  placeholderText,
  className = "",
  minDate,
  maxDate,
}: FormDatePickerProps) {
  const { control } = useFormContext();
  const { errors } = useFormState({ control, name });
  const error = errors[name];

  return (
    <div className={styles.datePickerWrapper}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date) => onChange(date)}
            showTimeSelect={showTimeSelect}
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat={dateFormat}
            placeholderText={placeholderText}
            minDate={minDate}
            maxDate={maxDate}
            className={`${styles.datePicker} ${
              error ? styles.datePickerError : ""
            } ${className}`}
            calendarClassName={styles.calendar}
            timeCaption="Time"
          />
        )}
      />
      {error?.message && (
        <span className={styles.formError}>{String(error.message)}</span>
      )}
    </div>
  );
}
