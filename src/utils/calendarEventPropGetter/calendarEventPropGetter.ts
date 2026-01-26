import type { Event } from "../../db/scheduleDb";
import type { CSSProperties } from "react";

type EventStyle = CSSProperties & {
  "--event-color"?: string;
};

export const calendarEventPropGetter = (event: Event) => {
  const bg = event.color;

  return {
    className: "colored-event",
    style: {
      "--event-color": bg,
    } as EventStyle,
  };
};
