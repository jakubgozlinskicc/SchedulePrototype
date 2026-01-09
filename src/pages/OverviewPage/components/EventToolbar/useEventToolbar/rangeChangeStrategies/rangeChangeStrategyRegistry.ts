import { DayChangeStrategy } from "./DayChangeStrategy";
import { MonthChangeStrategy } from "./MonthChangeStrategy";
import type {
  IRangeChangeStrategy,
  ViewOption,
  DateRange,
} from "./rangeChangeTypes";
import { WeekChangeStrategy } from "./WeekChangeStrategy";

const strategies: IRangeChangeStrategy[] = [
  new MonthChangeStrategy(),
  new WeekChangeStrategy(),
  new DayChangeStrategy(),
];

export const rangeChangeStrategyRegistry = {
  findStrategy(view: ViewOption): IRangeChangeStrategy {
    const strategy = strategies.find((s) => s.canExecute(view));

    if (!strategy) {
      throw new Error(`No strategy found for view: ${view}`);
    }

    return strategy;
  },

  getNextRange(view: ViewOption, currentDate: Date): DateRange {
    return this.findStrategy(view).getNextRange(currentDate);
  },

  getPreviousRange(view: ViewOption, currentDate: Date): DateRange {
    return this.findStrategy(view).getPreviousRange(currentDate);
  },

  getCurrentRange(view: ViewOption, currentDate: Date): DateRange {
    return this.findStrategy(view).getCurrentRange(currentDate);
  },
};
