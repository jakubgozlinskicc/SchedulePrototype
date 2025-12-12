import DatePicker from "react-datepicker";
import type { DatePickerDropdownProps } from "../types/datePickerTypes";
import "react-datepicker/dist/react-datepicker.css";

export const DatePickerDropdown = ({
  isOpen,
  selected,
  locale,
  config,
  onChange,
}: DatePickerDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div className="date-picker-dropdown">
      <DatePicker
        selected={selected}
        onChange={onChange}
        inline
        locale={locale}
        showMonthDropdown={config.showMonthDropdown}
        showYearDropdown
        dropdownMode="select"
        calendarStartDay={1}
        showMonthYearPicker={config.showMonthYearPicker}
        showFullMonthYearPicker={config.showFullMonthYearPicker}
      />
    </div>
  );
};
