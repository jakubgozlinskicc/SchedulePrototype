import type {
  IDatePickerStrategy,
  DatePickerConfig,
} from "../../types/datePickerTypes";

export class DayViewDatePickerStrategy implements IDatePickerStrategy {
  canSupport(view: string): boolean {
    return view === "day";
  }

  getConfig(): DatePickerConfig {
    return {
      showMonthYearPicker: false,
      showFullMonthYearPicker: false,
      showMonthDropdown: true,
      dateFormat: "dd/MM/yyyy",
    };
  }
}
