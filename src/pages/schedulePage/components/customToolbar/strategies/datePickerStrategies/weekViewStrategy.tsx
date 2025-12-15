import type { ComponentType } from "react";
import type {
  IDatePickerStrategy,
  DatePickerDropdownProps,
} from "../../types/datePickerTypes";
import { WeekViewDatePicker } from "../../components/WeekViewDatePicker";

export class WeekViewDatePickerStrategy implements IDatePickerStrategy {
  canSupport(view: string): boolean {
    return view === "week";
  }

  getComponent = (): ComponentType<DatePickerDropdownProps> => {
    return WeekViewDatePicker;
  };
}
