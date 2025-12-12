import type {
  IDatePickerStrategy,
  DatePickerConfig,
} from "../types/datePickerTypes";
import { MonthViewDatePickerStrategy } from "./datePickerStrategies/monthViewStrategy";
import { WeekViewDatePickerStrategy } from "./datePickerStrategies/weekViewStrategy";
import { DayViewDatePickerStrategy } from "./datePickerStrategies/dayViewStrategy";

const strategies: IDatePickerStrategy[] = [
  new MonthViewDatePickerStrategy(),
  new WeekViewDatePickerStrategy(),
  new DayViewDatePickerStrategy(),
];

export const DatePickerStrategyRegistry = {
  provideConfig(view: string): DatePickerConfig {
    const strategy = strategies.find((s) => s.canSupport(view));

    if (!strategy) {
      throw new Error(`No DatePickerStrategy found for view: ${view}`);
    }

    return strategy.getConfig();
  },
};
