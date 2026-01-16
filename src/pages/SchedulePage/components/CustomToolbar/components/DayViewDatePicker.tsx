import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DatePickerDropdownProps } from "../types/datePickerTypes";

export const DayViewDatePicker = (props: DatePickerDropdownProps) => {
  return (
    <div className="date-picker-dropdown">
      <DatePicker
        {...props}
        inline
        showMonthDropdown={true}
        showYearDropdown
        dropdownMode="select"
        calendarStartDay={1}
      />
    </div>
  );
};
