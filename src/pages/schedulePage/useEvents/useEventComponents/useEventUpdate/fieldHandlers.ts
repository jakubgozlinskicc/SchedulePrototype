import type { Event } from "../../../../../db/scheduleDb";
import type { RecurrenceType } from "../../../recurrence/recurrenceTypes";

export type TriggerShake = () => void;

export type FieldHandler = (
  prev: Event,
  name: string,
  value: string,
  triggerShake: TriggerShake
) => Event;

export const fieldHandlers: Record<string, FieldHandler> = {
  start: (prev, _name, value) => {
    const newDate = value ? new Date(value) : new Date();
    const updated: Event = { ...prev, start: newDate };

    if (newDate > prev.end) {
      updated.end = newDate;
    }

    return updated;
  },

  end: (prev, _name, value, triggerShake) => {
    const newDate = value ? new Date(value) : new Date();

    if (newDate < prev.start) {
      triggerShake();
      return { ...prev, end: prev.start };
    }

    return { ...prev, end: newDate };
  },

  recurrenceType: (prev, _name, value) => {
    const type = value as RecurrenceType;

    return {
      ...prev,
      recurrenceRule: {
        type,
        interval: prev.recurrenceRule?.interval ?? 1,
        endDate: prev.recurrenceRule?.endDate,
        count: prev.recurrenceRule?.count,
      },
    };
  },

  recurrenceInterval: (prev, _name, value) => {
    const interval = parseInt(value) || 1;

    return {
      ...prev,
      recurrenceRule: {
        type: prev.recurrenceRule?.type ?? "none",
        interval: Math.max(1, Math.min(100, interval)),
        endDate: prev.recurrenceRule?.endDate,
        count: prev.recurrenceRule?.count,
      },
    };
  },

  recurrenceEndType: (prev, _name, value) => {
    return {
      ...prev,
      recurrenceRule: {
        type: prev.recurrenceRule?.type ?? "none",
        interval: prev.recurrenceRule?.interval ?? 1,
        endDate: value === "date" ? new Date() : undefined,
        count: value === "count" ? 10 : undefined,
      },
    };
  },

  recurrenceEndDate: (prev, _name, value) => {
    return {
      ...prev,
      recurrenceRule: {
        type: prev.recurrenceRule?.type ?? "none",
        interval: prev.recurrenceRule?.interval ?? 1,
        endDate: value ? new Date(value) : undefined,
        count: undefined,
      },
    };
  },

  recurrenceCount: (prev, _name, value) => {
    const count = parseInt(value) || 1;

    return {
      ...prev,
      recurrenceRule: {
        type: prev.recurrenceRule?.type ?? "none",
        interval: prev.recurrenceRule?.interval ?? 1,
        endDate: undefined,
        count: Math.max(1, Math.min(365, count)),
      },
    };
  },
};

export const defaultFieldHandler: FieldHandler = (prev, name, value) => {
  return {
    ...prev,
    [name]: value,
  };
};
