import { useState, useRef, useEffect, type ComponentType } from "react";
import type { NavigateAction } from "react-big-calendar";
import { DatePickerStrategyRegistry } from "../../strategies/datePickerRegistry";
import type { DatePickerDropdownProps } from "../../types/datePickerTypes";

type OnNavigate = (action: NavigateAction, newDate?: Date) => void;

interface UseDatePickerOptions {
  onNavigate: OnNavigate;
  view: string;
}

interface UseDatePickerReturn {
  isDatePickerOpen: boolean;
  datePickerRef: React.RefObject<HTMLDivElement | null>;
  handleDateChange: (date: Date | null) => void;
  toggleDatePicker: () => void;
  closeDatePicker: () => void;
  DatePickerComponent: ComponentType<DatePickerDropdownProps>;
}

export const useDatePicker = ({
  onNavigate,
  view,
}: UseDatePickerOptions): UseDatePickerReturn => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const strategy = DatePickerStrategyRegistry.provideConfig(view);
  const DatePickerComponent = strategy.getComponent();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    if (isDatePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerOpen]);

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      onNavigate("DATE", newDate);
      setIsDatePickerOpen(false);
    }
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen((prev) => !prev);
  };

  const closeDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  return {
    isDatePickerOpen,
    datePickerRef,
    DatePickerComponent,
    handleDateChange,
    toggleDatePicker,
    closeDatePicker,
  };
};
