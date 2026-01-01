import { useRef, useState, type MouseEvent } from "react";
import { useHover } from "usehooks-ts";
import { createPortal } from "react-dom";
import type { Event } from "../../../../db/scheduleDb";
import { getTextColor } from "../../../../utils/getTextColor/getTextColor";
import { EventHover } from "../eventHover/eventHover";

interface CalendarEventProps {
  event: Event;
}

export function CalendarEvent({ event }: CalendarEventProps) {
  const hoverRef = useRef<HTMLDivElement>(null!);
  const isHovering = useHover(hoverRef);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const textColor = getTextColor(event.color);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        ref={hoverRef}
        onMouseMove={handleMouseMove}
        style={
          {
            height: "100%",
            cursor: "pointer",
            "--event-text-color": textColor,
          } as React.CSSProperties
        }
      >
        {(!event.id || event.recurrenceRule?.type !== "none") && (
          <i className="fa-solid fa-repeat" style={{ marginRight: "8px" }}></i>
        )}
        {event.title}
      </div>
      {isHovering &&
        createPortal(
          <EventHover event={event} position={position} />,
          document.body
        )}
    </>
  );
}
