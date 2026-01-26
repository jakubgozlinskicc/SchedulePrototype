import { BaseRecurrenceStrategy } from "./BaseRecurrenceStrategy";

export class MonthlyRecurrenceStrategy extends BaseRecurrenceStrategy {
  canSupport(type: string): boolean {
    return type === "monthly";
  }

  protected advanceDate(date: Date, interval: number): void {
    date.setMonth(date.getMonth() + interval);
  }

  protected getDefaultMaxOccurrences(): number {
    return 60;
  }
}
