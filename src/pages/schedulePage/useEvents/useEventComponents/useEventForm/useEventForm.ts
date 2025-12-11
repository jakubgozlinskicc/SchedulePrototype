import { useState, type ChangeEvent } from "react";
import { useEventDataContext } from "../../useContext/useEventDataContext";

export function useEventForm() {
  const [isShaking, setIsShaking] = useState(false);
  const { setEventData } = useEventDataContext();

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
