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
      try {
        const items = await repo.getEvents();
        setEvents(items);
      } catch (error) {
        console.error("Error during loading events:", error);
      }
    };
    load();
  }, [repo]);

  const reloadEvents = async () => {
    try {
      const items = await repo.getEvents();
      setEvents(items);
    } catch (error) {
      console.error("Error during reloading events:", error);
    }
  };

  const deleteCurrentEvent = async () => {
    if (!eventData.id) return;

    try {
      await repo.deleteEvent(eventData.id);
      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error during deleting event:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (eventData.id) {
        await repo.editEvent(eventData.id, eventData);
      } else {
        await repo.addEvent(eventData);
      }

      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error during saving events:", error);
    }
  };

  const updateEventTime = async (id: number, start: Date, end: Date) => {
    try {
      await repo.editEvent(id, { start, end });
      await reloadEvents();
    } catch (error) {
      console.error("Error during event time change:", error);
    }
  };

  return {
    events,
    deleteCurrentEvent,
    handleSubmit,
    updateEventTime,
  };
}
