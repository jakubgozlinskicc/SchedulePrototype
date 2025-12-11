import { createContext } from "react";
import type { Event } from "../../../db/scheduleDb";

export type EventContextType = {
  eventData: Event;
  setEventData: React.Dispatch<React.SetStateAction<Event>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
};

export const EventContext = createContext<EventContextType | undefined>(
  undefined
);
