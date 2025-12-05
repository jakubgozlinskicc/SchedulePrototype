import { useState, useEffect, type FormEvent } from "react";
import type { Event } from "../db/scheduleDb";
import { getEvents, editEvent, addEvent, deleteEvent } from "../db/eventRepo";

type EventData = Omit<Event, "id">;

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    color: "#0000FF",
  });

  const resetEventData = () => {
    setEventData({
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      color: "#0000FF",
    });
  };

  useEffect(() => {
    const load = async () => {
      const items = await getEvents();
      setEvents(items);
    };
    load();
  }, []);

  const openModal = (eventOrData?: Event | Partial<EventData>) => {
    if (!eventOrData) {
      setEditingEventId(null);
      resetEventData();
      setIsEditingMode(true);
      setIsModalOpen(true);
      return;
    }

    const hasId = "id" in eventOrData && eventOrData.id !== undefined;

    if (hasId) {
      const event = eventOrData as Event;
      setEditingEventId(event.id!);
      setEventData({
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        color: event.color,
      });
      setIsEditingMode(false);
      setIsModalOpen(true);
    } else {
      const partial = eventOrData as Partial<EventData>;
      setEditingEventId(null);
      setEventData({
        title: partial.title ?? "",
        description: partial.description ?? "",
        start: partial.start ?? new Date(),
        end: partial.end ?? new Date(),
        color: partial.color ?? "#0000FF",
      });
      setIsEditingMode(true);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEventId(null);
    resetEventData();
  };

  const beginEditCurrentEvent = () => {
    if (!editingEventId) return;
    setIsEditingMode(true);
  };
  const deleteCurrentEvent = async () => {
    if (!editingEventId) return;
    await deleteEvent(editingEventId);
    const items = await getEvents();
    setEvents(items);
    closeModal();
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();

    await addEvent(eventData);

    const items = await getEvents();
    setEvents(items);

    resetEventData();
    setIsModalOpen(false);
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

  const updateEventTime = async (id: number, start: Date, end: Date) => {
    await editEvent(id, { start, end });
    const items = await getEvents();
    setEvents(items);
  };

  return {
    events,
    isModalOpen,
    editingEventId,
    isEditingMode,
    eventData,

    setEventData,

    openModal,
    closeModal,

    beginEditCurrentEvent,
    deleteCurrentEvent,
    handleAddEvent,
    handleUpdateEvent,
    updateEventTime,
  };
}
