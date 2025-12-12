import type { Locale } from "date-fns";
import type { ComponentType } from "react";

export interface DatePickerDropdownProps {
  // isOpen: boolean;
  selected: Date;
  locale: Locale;
  // config: DatePickerConfig;
  onChange: (date: Date | null) => void;
}

export interface IDatePickerStrategy {
  canSupport: (view: string) => boolean;
  getComponent: () => ComponentType<DatePickerDropdownProps>;
}
