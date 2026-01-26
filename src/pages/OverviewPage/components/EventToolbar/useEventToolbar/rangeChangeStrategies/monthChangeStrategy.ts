import { addMonths, endOfMonth, startOfMonth } from "date-fns";
import type {
  DateRange,
  IRangeChangeStrategy,
  ViewOption,
} from "./rangeChangeTypes";

export class MonthChangeStrategy implements IRangeChangeStrategy {
  canExecute(view: ViewOption): boolean {
    return view === "month";
  }

  getCurrentRange(currentDate: Date): DateRange {
    return {
      dateFrom: startOfMonth(currentDate),
      dateTo: endOfMonth(currentDate),
    };
  }

  getNextRange(currentDate: Date): DateRange {
    return this.getCurrentRange(addMonths(currentDate, 1));
  }

  getPreviousRange(currentDate: Date): DateRange {
    return this.getCurrentRange(addMonths(currentDate, -1));
  }
}
