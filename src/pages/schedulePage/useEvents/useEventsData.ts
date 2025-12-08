import { useState, useEffect, type FormEvent } from "react";
import type { Event } from "../../../db/scheduleDb";
import type { IEventRepository } from "./IEventRepository";
import { dexieEventRepository } from "../../../db/eventRepository";

export function useEventsData(
  eventData: Event,
  closeModal: () => void,
  repo: IEventRepository = dexieEventRepository
) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const load = async () => {
      const items = await repo.getEvents();
      setEvents(items);
    };
    load();
  }, [repo]);

  const reloadEvents = async () => {
    const items = await repo.getEvents();
    setEvents(items);
  };

  const deleteCurrentEvent = async () => {
    if (!eventData.id) return;
    await repo.deleteEvent(eventData.id);
    await reloadEvents();
    closeModal();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (eventData.id) {
      await repo.editEvent(eventData.id, eventData);
    } else {
      await repo.addEvent(eventData);
    }

    await reloadEvents();
    closeModal();
  };

  const updateEventTime = async (id: number, start: Date, end: Date) => {
    await repo.editEvent(id, { start, end });
    await reloadEvents();
  };

  return {
    events,
    deleteCurrentEvent,
    handleSubmit,
    updateEventTime,
  };
}
