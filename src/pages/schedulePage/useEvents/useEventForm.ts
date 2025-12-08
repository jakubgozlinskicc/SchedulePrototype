import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Event } from "../../../db/scheduleDb";

export function useEventForm(setEventData: Dispatch<SetStateAction<Event>>) {
  const [isShaking, setIsShaking] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      const newDate = value ? new Date(value) : new Date();

      setEventData((prev) => {
        const updated = { ...prev, [name]: newDate };

        if (name === "start" && newDate > prev.end) {
          updated.end = newDate;
        }

        if (name === "end" && newDate < prev.start) {
          updated.end = prev.start;
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 300);
        }

        return updated;
      });

      return;
    }

    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    isShaking,
    handleChange,
  };
}
