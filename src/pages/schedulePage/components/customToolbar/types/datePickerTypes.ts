import type { Locale } from "date-fns";

export interface DatePickerConfig {
  showMonthYearPicker: boolean;
  showFullMonthYearPicker: boolean;
  showMonthDropdown: boolean;
  dateFormat: string;
}

export interface IDatePickerStrategy {
  canSupport: (view: string) => boolean;
  getConfig: () => DatePickerConfig;
}

export interface DatePickerDropdownProps {
  isOpen: boolean;
  selected: Date;
  locale: Locale;
  config: DatePickerConfig;
  onChange: (date: Date | null) => void;
}
