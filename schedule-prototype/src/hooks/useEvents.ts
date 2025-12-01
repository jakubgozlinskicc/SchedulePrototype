import { useState, useEffect, type FormEvent } from "react";
import type { Event } from "../db/scheduleDb";
import { getEvents, editEvent, addEvent, deleteEvent } from "../db/eventRepo";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventData, setEventData] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    color: "blue",
  });

  useEffect(() => {
    const load = async () => {
      const items = await getEvents();
      setEvents(items);
    };
    load();
  }, []);

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();

    await addEvent(eventData);

    const items = await getEvents();
    setEvents(items);

    setEventData({
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      color: "blue",
    });

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

    setEventData({
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      color: "blue",
    });

    setEditingEventId(null);

    setIsModalOpen(false);
  };
}
