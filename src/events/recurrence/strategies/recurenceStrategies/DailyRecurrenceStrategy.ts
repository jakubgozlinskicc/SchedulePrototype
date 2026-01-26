import { BaseRecurrenceStrategy } from "./BaseRecurrenceStrategy";

export class DailyRecurrenceStrategy extends BaseRecurrenceStrategy {
  canSupport(type: string): boolean {
    return type === "daily";
  }

  protected advanceDate(date: Date, interval: number): void {
    date.setDate(date.getDate() + interval);
  }

  protected getDefaultMaxOccurrences(): number {
    return 365;
  }
}
