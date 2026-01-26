import type { IRecurrenceStrategy } from "../recurrenceTypes";
import type { Event } from "../../../db/scheduleDb";
import { DailyRecurrenceStrategy } from "./recurenceStrategies/DailyRecurrenceStrategy";
import { WeeklyRecurrenceStrategy } from "./recurenceStrategies/WeeklyRecurrenceStrategy";
import { MonthlyRecurrenceStrategy } from "./recurenceStrategies/MonthlyRecurrenceStrategy";
import { YearlyRecurrenceStrategy } from "./recurenceStrategies/YearlyRecurrenceStrategy";

const strategies: IRecurrenceStrategy[] = [
  new DailyRecurrenceStrategy(),
  new WeeklyRecurrenceStrategy(),
  new MonthlyRecurrenceStrategy(),
  new YearlyRecurrenceStrategy(),
];

export const RecurrenceStrategyRegistry = {
  generateOccurrences(
    baseEvent: Event,
    rangeStart: Date,
    rangeEnd: Date
  ): Event[] {
    if (!baseEvent.recurrenceRule || baseEvent.recurrenceRule.type === "none") {
      return [baseEvent];
    }

    const strategy = strategies.find((s) =>
      s.canSupport(baseEvent.recurrenceRule!.type)
    );

    if (!strategy) {
      throw new Error(
        `No strategy found for recurrence type: ${baseEvent.recurrenceRule.type}`
      );
    }

    return strategy.generateOccurrences(
      baseEvent,
      baseEvent.recurrenceRule,
      rangeStart,
      rangeEnd
    );
  },
};
