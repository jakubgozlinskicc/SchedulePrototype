import { useContext } from "react";
import { EventContext } from "../../../../contexts/eventContext";

export function useEventDataContext() {
  const context = useContext(EventContext);

  if (context === undefined) {
    throw new Error("useEventData must be used within EventDataProvider");
  }

  return context;
}
