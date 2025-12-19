import { type ChangeEvent } from "react";
import { useEventDataContext } from "../../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useShake } from "./useShake";
import { fieldHandlers, defaultFieldHandler } from "./fieldHandlers";

export function useEventUpdate() {
  const { isShaking, triggerShake } = useShake();
  const { setEventData } = useEventDataContext();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const handler = fieldHandlers[name] ?? defaultFieldHandler;

    setEventData((prev) => handler(prev, name, value, triggerShake));
  };

  return {
    isShaking,
    handleChange,
  };
}
