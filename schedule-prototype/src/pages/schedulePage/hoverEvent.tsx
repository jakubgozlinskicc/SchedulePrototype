// HoverEvent.tsx

import React, { useState } from "react";
import type { Event } from "../../db/scheduleDb";

interface HoverEventProps {
  event: Event; // Typowanie wydarzenia
  children: React.ReactNode; // Typowanie dla dzieci (children)
}

const HoverEvent: React.FC<HoverEventProps> = ({ event, children }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", display: "inline-block" }}
    >
      {children}
      {hovered && (
        <div
          className="popover"
          style={{
            position: "absolute",
            top: "10px",
            left: "100%",
            zIndex: 9999,
            backgroundColor: "white",
            border: "1px solid gray",
            padding: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            width: "200px",
            borderRadius: "5px",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <strong>{event.title}</strong>
          <div>{event.start.toLocaleString()}</div>
          <div>{event.end.toLocaleString()}</div>
          <div>{event.description || "Brak opisu"}</div>
        </div>
      )}
    </div>
  );
};

export default HoverEvent;
