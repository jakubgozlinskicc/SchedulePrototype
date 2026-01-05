import { addWeeks, endOfWeek, startOfWeek } from "date-fns";
import type {
  DateRange,
  IRangeChangeStrategy,
  ViewOption,
} from "./rangeChangeTypes";

export class WeekChangeStrategy implements IRangeChangeStrategy {
  canExecute(view: ViewOption): boolean {
    return view === "week";
  }

  getCurrentRange(currentDate: Date): DateRange {
    return {
      dateFrom: startOfWeek(currentDate, { weekStartsOn: 1 }),
      dateTo: endOfWeek(currentDate, { weekStartsOn: 1 }),
    };
  }

  getNextRange(currentDate: Date): DateRange {
    return this.getCurrentRange(addWeeks(currentDate, 1));
  }

  getPreviousRange(currentDate: Date): DateRange {
    return this.getCurrentRange(addWeeks(currentDate, -1));
  }
}
