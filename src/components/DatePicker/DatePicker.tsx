import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./DatePicker.module.css";
import { variantDefaults, type DatePickerProps } from "./DatePicker.types";
import { useTranslationContext } from "../../locales/useTranslationContext";
import { locales } from "../../utils/calendarLocalizer/calendarLocalizer";

export function DatePicker({
  value,
  onChange,
  variant = "date",
  placeholderText,
  className = "",
  minDate,
  maxDate,
  error = false,
  disabled = false,
}: DatePickerProps) {
  const config = variantDefaults[variant];
  const { currentLanguage } = useTranslationContext();
  const locale = locales[currentLanguage];

  return (
    <div className={styles.wrapper}>
      <ReactDatePicker
        selected={value}
        locale={locale}
        onChange={onChange}
        showTimeSelect={config.showTimeSelect}
        timeFormat="HH:mm"
        timeIntervals={config.timeIntervals}
        dateFormat={config.dateFormat}
        placeholderText={placeholderText}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.error : ""} ${className}`}
        timeCaption="Czas"
        portalId="datepicker-portal"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        yearDropdownItemNumber={100}
        scrollableYearDropdown
      />
    </div>
  );
}
