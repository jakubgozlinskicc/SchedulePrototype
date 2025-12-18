import type { IEventRepository } from "../../IEventRepository";
import type { Event } from "../../../../../db/scheduleDb";
import { findNextVirtualInstance } from "./findNextVirtualInstance";

export async function setNewParentEvent(
  repository: IEventRepository,
  eventData: Event
) {
  const currentEventId = eventData.id!;
  const originalEvent = await repository.getEventById(currentEventId);
  if (!originalEvent || originalEvent.recurrenceRule?.type === "none") {
    await repository.editEvent(currentEventId, eventData);
    return;
  }

  const nextInstance = await findNextVirtualInstance(
    repository,
    currentEventId,
    eventData.start
  );

  if (nextInstance) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...parentCopy } = originalEvent;

    if (
      parentCopy.recurrenceRule?.count !== undefined &&
      parentCopy.recurrenceRule.count > 0
    ) {
      parentCopy.recurrenceRule.count -= nextInstance.index;
    }
    await repository.addEvent({
      ...parentCopy,
      start: nextInstance.event.start,
      end: nextInstance.event.end,
      recurringEventId: undefined,
    });
  }
}
