import type { ComponentType } from "react";
import type {
  IDatePickerStrategy,
  DatePickerDropdownProps,
} from "../../types/datePickerTypes";
import { DayViewDatePicker } from "../../components/DayViewDatePicker";

export class DayViewDatePickerStrategy implements IDatePickerStrategy {
  canSupport(view: string): boolean {
    return view === "day";
  }

  getComponent = (): ComponentType<DatePickerDropdownProps> => {
    return DayViewDatePicker;
  };
}
