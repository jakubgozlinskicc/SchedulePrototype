export type DatePickerVariant = "date" | "datetime";

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  variant?: DatePickerVariant;
  placeholderText?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  error?: boolean;
  disabled?: boolean;
}

export interface DatePickerConfig {
  showTimeSelect: boolean;
  dateFormat: string;
  timeIntervals?: number;
  icon: string;
}

export const variantDefaults: Record<DatePickerVariant, DatePickerConfig> = {
  date: {
    showTimeSelect: false,
    dateFormat: "dd/MM/yyyy",
    icon: "fa-regular fa-calendar",
  },
  datetime: {
    showTimeSelect: true,
    dateFormat: "dd/MM/yyyy HH:mm",
    timeIntervals: 5,
    icon: "fa-regular fa-calendar-clock",
  },
};
