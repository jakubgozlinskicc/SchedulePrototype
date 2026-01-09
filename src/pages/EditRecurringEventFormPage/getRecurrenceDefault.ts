import type { Event } from "../../db/scheduleDb";
import type { RecurrenceType } from "../../events/recurrence/recurrenceTypes";
import { toDateTimeLocal } from "../../utils/toDateTimeLocal/toDateTimeLocal";

export interface RecurrenceFormFields {
  recurrenceType: RecurrenceType;
  recurrenceEndType: "never" | "date" | "count";
  recurrenceEndDate: string | null | undefined;
  recurrenceCount: number | null | undefined;
}

export function getRecurrenceDefaults(
  eventData: Event | null
): RecurrenceFormFields {
  const rule = eventData?.recurrenceRule;

  if (!rule || rule.type === "none") {
    return {
      recurrenceType: "none",
      recurrenceEndType: "never",
      recurrenceEndDate: null,
      recurrenceCount: null,
    };
  }

  let recurrenceEndType: "never" | "date" | "count" = "never";
  let recurrenceEndDate: string | null = null;
  let recurrenceCount: number | null = null;

  if (rule.endDate) {
    recurrenceEndType = "date";
    recurrenceEndDate = toDateTimeLocal(rule.endDate);
  } else if (rule.count) {
    recurrenceEndType = "count";
    recurrenceCount = rule.count;
  }

  return {
    recurrenceType: rule.type as RecurrenceType,
    recurrenceEndType,
    recurrenceEndDate,
    recurrenceCount,
  };
}
