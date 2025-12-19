import { eventRepository } from "../../../db/eventRepository";
import { useLoadEvents } from "../../../events/useEvents/useEventData/useLoadEvents/useLoadEvents";
import { useEventDataContext } from "../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useTranslationContext } from "../../../locales/useTranslationContext";

export function EventList() {
  const { events } = useEventDataContext();

  const { currentLanguage } = useTranslationContext();

  useLoadEvents(eventRepository);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(
      currentLanguage === "pl" ? "pl-PL" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="events-list">
      {events.map((event) => (
        <div
          key={event.id}
          className="event-item"
          style={{
            borderLeftColor: event.color,
            borderRightColor: event.color,
          }}
        >
          <div>
            <div className="event-title">{event.title}</div>
            <div className="event-time">
              <span>{formatDate(event.start)}</span>
              <span> — </span>
              <span>{formatDate(event.end)}</span>
            </div>
            {event.description && (
              <div className="event-description">{event.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
