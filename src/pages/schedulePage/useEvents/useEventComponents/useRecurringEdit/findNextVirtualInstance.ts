import type { Event } from "../../../../../db/scheduleDb";
import { RecurrenceStrategyRegistry } from "../../../recurrence/strategies/recurrenceStrategyRegistry";
import type { IEventRepository } from "../../IEventRepository";

export async function findNextVirtualInstance(
  repository: IEventRepository,
  parentEventId: number,
  afterDate: Date = new Date()
): Promise<{ index: number; event: Event } | null> {
  try {
    const parentEvent = await repository.getEventById(parentEventId);

    if (!parentEvent || parentEvent.recurrenceRule?.type === "none") {
      return null;
    }

    const rangeStart = afterDate;
    const rangeEnd = new Date(afterDate);
    rangeEnd.setFullYear(rangeEnd.getFullYear() + 2);

    const occurrences = RecurrenceStrategyRegistry.generateOccurrences(
      parentEvent,
      rangeStart,
      rangeEnd
    );

    const cancelledDates = parentEvent.cancelledDates ?? [];

    for (const [index, occ] of occurrences.entries()) {
      const isAfterDate = occ.start > afterDate;
      const isCancelled = cancelledDates.includes(occ.start.getTime());

      if (isAfterDate && !isCancelled) {
        return {
          index,
          event: occ,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding next instance:", error);
    return null;
  }
}
