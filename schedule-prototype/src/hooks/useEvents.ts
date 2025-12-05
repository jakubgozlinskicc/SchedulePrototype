import { useState, useEffect, type FormEvent } from "react";
import type { Event } from "../db/scheduleDb";
import { getEvents, editEvent, addEvent, deleteEvent } from "../db/eventRepo";

const defaultEventData: Event = {
  title: "",
  description: "",
  start: new Date(),
  end: new Date(),
  color: "#0000FF",
};

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
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
    setEditingEventId(null);
    resetEventData();
  };

  const deleteCurrentEvent = async () => {
    if (!editingEventId) return;
    await deleteEvent(editingEventId);
    const items = await getEvents();
    setEvents(items);
    closeModal();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingEventId) {
      await editEvent(editingEventId, eventData);
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
    editingEventId,
    eventData,

    setEventData,

    openModal,
    closeModal,

    deleteCurrentEvent,
    handleSubmit,
    updateEventTime,
  };
}
