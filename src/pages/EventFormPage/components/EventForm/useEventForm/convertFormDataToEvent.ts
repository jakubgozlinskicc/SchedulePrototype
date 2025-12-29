import type { Event } from "../../../../../db/scheduleDb";
import type { EventFormData } from "../eventFormSchema";
import type { RecurrenceRule } from "../../../../../events/recurrence/recurrenceTypes";

function buildRecurrenceRule(data: EventFormData): RecurrenceRule | undefined {
  if (data.recurrenceType === "none") {
    return undefined;
  }

  const rule: RecurrenceRule = {
    type: data.recurrenceType,
    interval: 1,
  };

  if (data.recurrenceEndType === "date" && data.recurrenceEndDate) {
    rule.endDate = new Date(data.recurrenceEndDate);
  }

  if (data.recurrenceEndType === "count" && data.recurrenceCount) {
    rule.count = data.recurrenceCount;
  }

  return rule;
}

export function convertFormDataToEvent(
  data: EventFormData,
  eventData?: Event
): Event {
  return {
    ...eventData,
    title: data.title,
    description: data.description,
    start: new Date(data.start),
    end: new Date(data.end),
    color: data.color,
    recurrenceRule: buildRecurrenceRule(data),
  };
}
