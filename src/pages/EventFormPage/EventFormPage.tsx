import { useParams } from "react-router-dom";
import { EventFormStrategyRegistry } from "./strategies/eventFormStrategyRegistry";
import type { EventFormPageContext } from "./eventFormTypes";

export function EventFormPage() {
  const { id } = useParams();

  const context: EventFormPageContext = {
    mode: id ? "edit" : "add",
    eventId: id ? Number(id) : undefined,
  };

  const strategy = EventFormStrategyRegistry.getStrategy(context);

  return <div className="event-form-page">{strategy.render(context)}</div>;
}
