import { useState, useEffect, type FormEvent } from "react";
import type { Event } from "../../db/scheduleDb";
import {
  getEvents,
  editEvent,
  addEvent,
  deleteEvent,
} from "../../db/eventRepo";

export function useEventsData(eventData: Event, closeModal: () => void) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const load = async () => {
      const items = await getEvents();
      setEvents(items);
    };
    load();
  }, []);

  const reloadEvents = async () => {
    const items = await getEvents();
    setEvents(items);
  };

  const deleteCurrentEvent = async () => {
    if (!eventData.id) return;
    await deleteEvent(eventData.id);
    await reloadEvents();
    closeModal();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (eventData.id) {
      await editEvent(eventData.id, eventData);
    } else {
      await addEvent(eventData);
    }

    await reloadEvents();
    closeModal();
  };

  const updateEventTime = async (id: number, start: Date, end: Date) => {
    await editEvent(id, { start, end });
    await reloadEvents();
  };

  return {
    events,
    deleteCurrentEvent,
    handleSubmit,
    updateEventTime,
  };
}
