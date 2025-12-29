import { EventFormStrategyRegistry } from "./strategies/eventFormStrategyRegistry";
import { useEventDataContext } from "../../events/useEvents/useEventDataContext/useEventDataContext";

export function EventFormPage() {
  const { eventData } = useEventDataContext();

  const { render } = EventFormStrategyRegistry.provideRenderer(eventData);

  return <div className="event-form-page">{render()}</div>;
}
