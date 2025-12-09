import { useState, type MouseEvent } from "react";
import type { Event } from "../../../../db/scheduleDb";

export function useEventHover() {
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnterEvent = (event: Event, e: MouseEvent<HTMLElement>) => {
    setHoveredEvent(event);
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };

  const clearHover = () => {
    setHoveredEvent(null);
  };

  return {
    hoveredEvent,
    hoverPosition,
    handleMouseEnterEvent,
    clearHover,
  };
}
