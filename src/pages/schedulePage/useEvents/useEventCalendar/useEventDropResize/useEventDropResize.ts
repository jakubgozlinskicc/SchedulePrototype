import { useCallback } from "react";
import type { Event } from "../../../../../db/scheduleDb";
import { DropResizeStrategyRegistry } from "./dropResizeStrategies.ts/dropResizeStrategyRegistry";
import type { IEventRepository } from "../../IEventRepository";
import { useReloadEvents } from "../../useEventData/useReloadEvents/useReloadEvents";

type DragDropArgs = {
  event: Event;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
};

export function useEventDropResize(repository: IEventRepository) {
  const { reloadEvents } = useReloadEvents(repository);

  const handleEventDropResize = useCallback(
    async ({ event, start, end }: DragDropArgs) => {
      const startDate = start instanceof Date ? start : new Date(start);
      const endDate = end instanceof Date ? end : new Date(end);
      try {
        await DropResizeStrategyRegistry.executeDropResize(
          event,
          startDate,
          endDate,
          repository
        );
        await reloadEvents();
      } catch (error) {
        console.error("Error during droping or resizing event:", error);
      }
    },
    [repository, reloadEvents]
  );

  return {
    handleEventDropResize,
  };
}
