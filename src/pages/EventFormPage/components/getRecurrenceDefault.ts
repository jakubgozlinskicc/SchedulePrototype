import type { Event } from "../../../db/scheduleDb";
import { toDateTimeLocal } from "../../../utils/toDateTimeLocal/toDateTimeLocal";

export function getRecurrenceDefaults(eventData: Event | null) {
  const rule = eventData?.recurrenceRule;

  if (!rule || rule.type === "none") {
    return {
      recurrenceType: "none" as const,
      recurrenceEndType: "never" as const,
      recurrenceEndDate: undefined,
      recurrenceCount: undefined,
    };
  }

  let recurrenceEndType: "never" | "date" | "count" = "never";
  let recurrenceEndDate: string | undefined = undefined;
  let recurrenceCount: number | undefined = undefined;

  if (rule.endDate) {
    recurrenceEndType = "date";
    recurrenceEndDate = toDateTimeLocal(rule.endDate);
  } else if (rule.count) {
    recurrenceEndType = "count";
    recurrenceCount = rule.count;
  }

  return {
    recurrenceType: rule.type,
    recurrenceEndType,
    recurrenceEndDate,
    recurrenceCount,
  };
}
