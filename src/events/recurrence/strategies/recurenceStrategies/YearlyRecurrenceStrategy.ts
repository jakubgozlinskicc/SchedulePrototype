import { BaseRecurrenceStrategy } from "./BaseRecurrenceStartegy";

export class YearlyRecurrenceStrategy extends BaseRecurrenceStrategy {
  canSupport(type: string): boolean {
    return type === "yearly";
  }

  protected advanceDate(date: Date, interval: number): void {
    date.setFullYear(date.getFullYear() + interval);
  }

  protected getDefaultMaxOccurrences(): number {
    return 10;
  }
}
