import { BaseRecurrenceStrategy } from "./BaseRecurrenceStrategy";

export class WeeklyRecurrenceStrategy extends BaseRecurrenceStrategy {
  canSupport(type: string): boolean {
    return type === "weekly";
  }

  protected advanceDate(date: Date, interval: number): void {
    date.setDate(date.getDate() + 7 * interval);
  }

  protected getDefaultMaxOccurrences(): number {
    return 104;
  }
}
