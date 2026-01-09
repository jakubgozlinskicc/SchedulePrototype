import type { DateRange } from "./reloadEventTypes";

export function getDefaultDateRange(): DateRange {
  const now = new Date();

  return {
    start: new Date(now.getFullYear() - 1, 0, 1),
    end: new Date(now.getFullYear() + 5, 11, 31),
  };
}
