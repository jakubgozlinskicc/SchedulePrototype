import { useState, useEffect, useCallback, type FormEvent } from "react";
import type { Event } from "../../../db/scheduleDb";
import type { IEventRepository } from "./IEventRepository";
import { useEventDataContext } from "./useContext/useEventDataContext";

export function useEventsData(
  closeModal: () => void,
  repository: IEventRepository
) {
  const { eventData } = useEventDataContext();

  const [events, setEvents] = useState<Event[]>([]);

  const reloadEvents = useCallback(async () => {
    try {
      const items = await repository.getEvents();
      setEvents(items);
    } catch (error) {
      console.error("Error during reloading events:", error);
    }
  }, [repository]);

  useEffect(() => {
    const load = async () => {
      try {
        await reloadEvents();
      } catch (error) {
        console.error("Error during loading events:", error);
      }
    };
    void load();
  }, [reloadEvents]);

  const deleteCurrentEvent = useCallback(async () => {
    if (!eventData.id) return;

    try {
      await repository.deleteEvent(eventData.id);
      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error during deleting event:", error);
    }
  }, [eventData.id, repository, reloadEvents, closeModal]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        if (eventData.id) {
          await repository.editEvent(eventData.id, eventData);
        } else {
          await repository.addEvent(eventData);
        }

        await reloadEvents();
        closeModal();
      } catch (error) {
        console.error("Error during saving events:", error);
      }
    },
    [eventData, repository, reloadEvents, closeModal]
  );

  const updateEventTime = useCallback(
    async (id: number, start: Date, end: Date) => {
      try {
        await repository.editEvent(id, { start, end });
        await reloadEvents();
      } catch (error) {
        console.error("Error during event time change:", error);
      }
    },
    [repository, reloadEvents]
  );

  return {
    events,
    deleteCurrentEvent,
    handleSubmit,
    updateEventTime,
  };
}
