import { useState, useEffect, type FormEvent } from "react";
import type { Event } from "../db/scheduleDb";
import { getEvents, editEvent, addEvent, deleteEvent } from "../db/eventRepo";

const defaultEventData: Event = {
  id: undefined,
  title: "",
  description: "",
  start: new Date(),
  end: new Date(),
  color: "#0000FF",
};

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventData, setEventData] = useState<Event>(defaultEventData);

  const resetEventData = () => {
    setEventData(defaultEventData);
  };

  useEffect(() => {
    const load = async () => {
      const items = await getEvents();
      setEvents(items);
    };
    load();
  }, []);

  const openModal = (data?: Partial<Event & { id?: number }>) => {
    setEventData({
      ...defaultEventData,
      ...data,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetEventData();
  };

  const deleteCurrentEvent = async () => {
    if (!eventData.id) return;
    await deleteEvent(eventData.id);
    const items = await getEvents();
    setEvents(items);
    closeModal();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (eventData.id) {
      await editEvent(eventData.id, eventData);
    } else {
      await addEvent(eventData);
    }

    const items = await getEvents();
    setEvents(items);

    closeModal();
  };

  const updateEventTime = async (id: number, start: Date, end: Date) => {
    await editEvent(id, { start, end });
    const items = await getEvents();
    setEvents(items);
  };

  return {
    events,
    isModalOpen,
    eventData,

    setEventData,

    openModal,
    closeModal,

    deleteCurrentEvent,
    handleSubmit,
    updateEventTime,
  };
}
