import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DatePickerDropdownProps } from "../types/datePickerTypes";

export const MonthViewDatePicker = (props: DatePickerDropdownProps) => {
  return (
    <div className="date-picker-dropdown">
      <DatePicker
        {...props}
        inline
        showMonthYearPicker={true}
        showFullMonthYearPicker={true}
        showYearDropdown
        dropdownMode="select"
      />
    </div>
  );
};
