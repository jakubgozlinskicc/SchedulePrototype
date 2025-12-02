import { useState, useEffect, type FormEvent } from "react";
import type { Event } from "../db/scheduleDb";
import { getEvents, editEvent, addEvent, deleteEvent } from "../db/eventRepo";

type EventData = Omit<Event, "id">;

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    color: "blue",
  });

  const resetEventData = () => {
    setEventData({
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      color: "blue",
    });
  };

  useEffect(() => {
    const load = async () => {
      const items = await getEvents();
      setEvents(items);
    };
    load();
  }, []);

  const openAddModal = (initial?: Partial<EventData>) => {
    setEditingEventId(null);
    setEventData({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      start: initial?.start ?? new Date(),
      end: initial?.end ?? new Date(),
      color: initial?.color ?? "blue",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    if (!event.id) return;

    setEditingEventId(event.id);
    setEventData({
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      color: event.color,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEventId(null);
    resetEventData();
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();

    await addEvent(eventData);

    const items = await getEvents();
    setEvents(items);

    resetEventData();
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!event.id) return;

    await deleteEvent(event.id);

    const items = await getEvents();
    setEvents(items);
  };

  const handleUpdateEvent = async (e: FormEvent) => {
    e.preventDefault();

    if (!editingEventId) return;

    await editEvent(editingEventId, eventData);

    const items = await getEvents();
    setEvents(items);

    resetEventData();
    setEditingEventId(null);
    setIsModalOpen(false);
  };

  return {
    events,
    isModalOpen,
    editingEventId,
    eventData,

    setEventData,

    openAddModal,
    openEditModal,
    closeModal,

    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
  };
}
