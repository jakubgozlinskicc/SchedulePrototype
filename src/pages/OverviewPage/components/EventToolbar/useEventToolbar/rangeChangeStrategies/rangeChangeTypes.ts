export type ViewOption = "day" | "week" | "month";

export interface DateRange {
  dateFrom: Date;
  dateTo: Date;
}

export interface IRangeChangeStrategy {
  canExecute(view: ViewOption): boolean;
  getNextRange(currentDate: Date): DateRange;
  getPreviousRange(currentDate: Date): DateRange;
  getCurrentRange(currentDate: Date): DateRange;
}
