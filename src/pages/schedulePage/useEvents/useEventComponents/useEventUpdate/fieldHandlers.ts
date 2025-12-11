import type { Event } from "../../../../../db/scheduleDb";

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
};

export const defaultFieldHandler: FieldHandler = (prev, name, value) => {
  return {
    ...prev,
    [name]: value,
  };
};
