import { type ChangeEvent, useCallback } from "react";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { useShake } from "./useShake";
import { fieldHandlers, defaultFieldHandler } from "./fieldHandlers";

export function useEventUpdate() {
  const { isShaking, triggerShake } = useShake();
  const { setEventData } = useEventDataContext();

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;

      const handler = fieldHandlers[name] ?? defaultFieldHandler;

      setEventData((prev) => handler(prev, name, value, triggerShake));
    },
    [setEventData, triggerShake]
  );

  return {
    isShaking,
    handleChange,
  };
}
