import { useState, type ReactNode } from "react";
import type { Event } from "../db/scheduleDb";
import { getDefaultEvent } from "../utils/getDefaultEvent";
import { EventContext } from "./eventContext";

type EventProviderProps = {
  children: ReactNode;
};

export function EventDataProvider({ children }: EventProviderProps) {
  const [eventData, setEventData] = useState<Event>(getDefaultEvent());

  const value = {
    eventData,
    setEventData,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
