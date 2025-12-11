import { useState, type ReactNode } from "react";
import type { Event } from "../../../db/scheduleDb";
import { getDefaultEvent } from "../../../utils/getDefaultEvent/getDefaultEvent";
import { EventContext } from "./eventContext";

type EventProviderProps = {
  children: ReactNode;
};

export function EventDataProvider({ children }: EventProviderProps) {
  const [eventData, setEventData] = useState<Event>(getDefaultEvent());
  const [events, setEvents] = useState<Event[]>([]);

  const value = {
    eventData,
    setEventData,
    events,
    setEvents,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
