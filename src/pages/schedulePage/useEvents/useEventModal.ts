import { useState } from "react";
import type { Event } from "../../../db/scheduleDb";
import { getDefaultEvent } from "../../../utils/getDefaultEvent";

export function useEventModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventData, setEventData] = useState<Event>(getDefaultEvent());

  const openModal = (data?: Partial<Event & { id?: number }>) => {
    setEventData({
      ...getDefaultEvent(),
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
