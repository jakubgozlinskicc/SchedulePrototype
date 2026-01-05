import { addDays, endOfDay, startOfDay } from "date-fns";
import type {
  DateRange,
  IRangeChangeStrategy,
  ViewOption,
} from "./rangeChangeTypes";

export class DayChangeStrategy implements IRangeChangeStrategy {
  canExecute(view: ViewOption): boolean {
    return view === "day";
  }

  getCurrentRange(currentDate: Date): DateRange {
    return {
      dateFrom: startOfDay(currentDate),
      dateTo: endOfDay(currentDate),
    };
  }

  getNextRange(currentDate: Date): DateRange {
    return this.getCurrentRange(addDays(currentDate, 1));
  }

  getPreviousRange(currentDate: Date): DateRange {
    return this.getCurrentRange(addDays(currentDate, -1));
  }
}
