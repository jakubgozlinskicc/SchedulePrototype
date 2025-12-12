import type {
  IDatePickerStrategy,
  DatePickerConfig,
} from "../../types/datePickerTypes";

export class WeekViewDatePickerStrategy implements IDatePickerStrategy {
  canSupport(view: string): boolean {
    return view === "week";
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
