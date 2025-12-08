import type { Event } from "../../../../db/scheduleDb";

export type EventModalType = "ADD" | "EDIT";

interface EventModalStrategy {
  type: EventModalType;
  supports: (eventData: Event) => boolean;
}

const addEventStrategy: EventModalStrategy = {
  type: "ADD",
  supports: (eventData: Event) => !eventData.id,
};

const editEventStrategy: EventModalStrategy = {
  type: "EDIT",
  supports: (eventData: Event) => !!eventData.id,
};

const strategies: EventModalStrategy[] = [addEventStrategy, editEventStrategy];

const strategiesByType = new Map<EventModalType, EventModalStrategy>();
strategies.forEach((strategy) => {
  strategiesByType.set(strategy.type, strategy);
});

export const eventModalStrategyRegistry = {
  getTypeByEvent(eventData: Event): EventModalType {
    const strategy = strategies.find((s) => s.supports(eventData));

    if (!strategy) {
      throw new Error(
        `No EventModalStrategy found for event with id=${
          eventData.id ?? "null"
        }`
      );
    }

    return strategy.type;
  },
};
