import { useState, useEffect, type MouseEvent } from "react";
import type { Event } from "../../db/scheduleDb";

export function useEventHover() {
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const handleEventMouseEnter = (event: Event, e: MouseEvent<HTMLElement>) => {
    setHoveredEvent(event);
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };

  const clearHover = () => {
    setHoveredEvent(null);
  };

  useEffect(() => {
    if (!hoveredEvent) return;

    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      setHoverPosition({ x: e.clientX, y: e.clientY });

      const el = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;

      const isOverEvent = el && el.closest(".rbc-event");

      if (!isOverEvent) {
        setHoveredEvent(null);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [hoveredEvent]);

  return {
    hoveredEvent,
    hoverPosition,
    handleEventMouseEnter,
    clearHover,
  };
}
