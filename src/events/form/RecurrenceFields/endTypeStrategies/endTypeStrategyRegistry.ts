import type { IEndTypeStrategy, EndType } from "../recurrenceFieldsTypes";
import { CountEndStrategy } from "./CountEndStrategy";
import { DateEndStrategy } from "./DateEndStrategy";
import { NeverEndStrategy } from "./NeverEndStrategy";

const strategies: IEndTypeStrategy[] = [
  new DateEndStrategy(),
  new CountEndStrategy(),
  new NeverEndStrategy(),
];

export const EndTypeStrategyRegistry = {
  provideConfig(endType: EndType): IEndTypeStrategy {
    const strategy = strategies.find((s) => s.type === endType);

    if (!strategy) {
      throw new Error(`No EndTypeStrategy found for endType: ${endType}`);
    }

    return strategy;
  },
};
