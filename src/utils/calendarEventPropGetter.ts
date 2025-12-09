import type { Event } from "../db/scheduleDb";
import type { CSSProperties } from "react";
import { getTextColor } from "./colorUtils";

export const calendarEventPropGetter = (event: Event) => {
  const bg = event.color;
  const textColor = getTextColor(bg);

  return {
    className: "colored-event",
    style: {
      "--event-color": bg,
      color: textColor,
    } satisfies CSSProperties & { "--event-color": string },
  };
};
