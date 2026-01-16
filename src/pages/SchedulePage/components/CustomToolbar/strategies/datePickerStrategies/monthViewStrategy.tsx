import type { ComponentType } from "react";
import type {
  IDatePickerStrategy,
  DatePickerDropdownProps,
} from "../../types/datePickerTypes";
import { MonthViewDatePicker } from "../../components/MonthViewDatePicker";

export class MonthViewDatePickerStrategy implements IDatePickerStrategy {
  canSupport(view: string): boolean {
    return view === "month";
  }

  getComponent = (): ComponentType<DatePickerDropdownProps> => {
    return MonthViewDatePicker;
  };
}
