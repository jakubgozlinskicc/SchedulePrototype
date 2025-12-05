import { useState, useEffect, type MouseEvent } from "react";
import type { Event } from "../db/scheduleDb";

export function useEventHover() {
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (!hoveredEvent) return;

      const eventElements = document.querySelectorAll(".rbc-event");
      let isOverAnyEvent = false;

      eventElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          isOverAnyEvent = true;
        }
      });

      if (!isOverAnyEvent) {
        setHoveredEvent(null);
      }
    };

    if (hoveredEvent) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [hoveredEvent]);

  const handleEventMouseEnter = (event: Event, e: MouseEvent<HTMLElement>) => {
    setHoveredEvent(event);
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };

  const handleEventMouseLeave = () => {
    setHoveredEvent(null);
  };

  const updateHoverPosition = (event: Event, e: MouseEvent<HTMLElement>) => {
    if (hoveredEvent?.id === event.id) {
      setHoverPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const clearHover = () => {
    setHoveredEvent(null);
  };

  return {
    hoveredEvent,
    hoverPosition,
    handleEventMouseEnter,
    handleEventMouseLeave,
    updateHoverPosition,
    clearHover,
  };
}
