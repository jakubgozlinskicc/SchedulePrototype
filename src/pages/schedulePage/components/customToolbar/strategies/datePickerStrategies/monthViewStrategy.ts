import type {
  IDatePickerStrategy,
  DatePickerConfig,
} from "../../types/datePickerTypes";

export class MonthViewDatePickerStrategy implements IDatePickerStrategy {
  canSupport(view: string): boolean {
    return view === "month";
  }

  getConfig(): DatePickerConfig {
    return {
      showMonthYearPicker: true,
      showFullMonthYearPicker: true,
      showMonthDropdown: false,
      dateFormat: "MM/yyyy",
    };
  }
}
