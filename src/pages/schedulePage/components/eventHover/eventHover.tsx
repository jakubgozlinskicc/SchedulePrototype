import { useMemo } from "react";
import type { Event } from "../../../../db/scheduleDb";
import "./eventHover.css";
import { getTextColor } from "../../../../utils/colorUtils";

interface EventHoverProps {
  event: Event;
  position: { x: number; y: number };
}

export function EventHover({ event, position }: EventHoverProps) {
  const adjustedPosition = useMemo(() => {
    const hover = document.querySelector(".event-hover");
    if (!hover) return position;

    const rect = hover.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newX = position.x + 15;
    let newY = position.y + 15;

    if (newX + rect.width > viewportWidth) {
      newX = position.x - rect.width - 15;
    }
    if (newY + rect.height > viewportHeight) {
      newY = position.y - rect.height - 15;
    }
    return { x: newX, y: newY };
  }, [position]);

  const textColor = getTextColor(event.color);

  return (
    <div
      className="event-hover"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        pointerEvents: "none",
      }}
    >
      <div
        className="hover-header"
        style={{ backgroundColor: event.color, color: textColor }}
      >
        <h3 className="hover-title" style={{ color: textColor }}>
          {event.title}
        </h3>
      </div>

      <div className="hover">
        <div className="view-field">
          <span className="view-label">Początek: </span>
          <span className="view-value">{event.start.toLocaleString()}</span>
        </div>

        <div className="view-field">
          <span className="view-label">Koniec: </span>
          <span className="view-value">{event.end.toLocaleString()}</span>
        </div>

        <div className="view-field">
          <span className="view-label">Opis: </span>
          <span className="view-value">
            {event.description || "Brak opisu"}
          </span>
        </div>
      </div>

      <div className="hover-footer">
        <small>Kliknij aby edytować lub zobaczyć pełny opis</small>
      </div>
    </div>
  );
}
