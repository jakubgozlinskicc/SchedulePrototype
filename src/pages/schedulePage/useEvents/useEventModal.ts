import { useState } from "react";
import type { Event } from "../../../db/scheduleDb";

const defaultEventData: Event = {
  id: undefined,
  title: "",
  description: "",
  start: new Date(),
  end: new Date(),
  color: "#0000FF",
};

export function useEventModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventData, setEventData] = useState<Event>(defaultEventData);

  const openModal = (data?: Partial<Event & { id?: number }>) => {
    setEventData({
      ...defaultEventData,
      ...data,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    eventData,
    setEventData,
    openModal,
    closeModal,
  };
}
