import { useState, useRef, useCallback } from "react";

export function useShake(duration = 300) {
  const [isShaking, setIsShaking] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const triggerShake = useCallback(() => {
    setIsShaking(true);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsShaking(false);
    }, duration);
  }, [duration]);

  return {
    isShaking,
    triggerShake,
  };
}
