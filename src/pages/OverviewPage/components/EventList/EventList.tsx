import { eventRepository } from "../../../../db/eventRepository";
import { useLoadEvents } from "../../../../events/useEvents/useEventData/useLoadEvents/useLoadEvents";
import { useEventList } from "./useEventList/useEventList";
import { Pagination } from "../Pagination/Pagination";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./EventList.css";

export function EventList() {
  useLoadEvents(eventRepository);

  const { groupedEvents, formatTime, pagination } = useEventList();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (groupedEvents.length === 0) {
    return (
      <div className="events-list">
        <p className="no-events">{t("no-upcoming-events")}</p>
      </div>
    );
  }

  return (
    <div className="events-list">
      {groupedEvents.map((group) => (
        <div key={group.dateKey} className="day-group">
          <div className="day-header">{group.dateLabel}</div>

          {group.events.map((event) => (
            <div
              key={event.id}
              className="event-item"
              style={{
                borderLeftColor: event.color,
                borderRightColor: event.color,
              }}
            >
              <div className="event-content">
                <div className="event-header">
                  <span className="event-title">{event.title}</span>
                  <button
                    className="nav-button"
                    onClick={() => navigate(`/event/edit/${event.id}`)}
                  >
                    {t("edit")}
                  </button>
                </div>
                <div className="event-time">
                  {formatTime(event.start)} — {formatTime(event.end)}
                </div>
                {event.description && (
                  <div className="event-description">{event.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        onNext={pagination.goToNextPage}
        onPrevious={pagination.goToPreviousPage}
        hasNext={pagination.hasNextPage}
        hasPrevious={pagination.hasPreviousPage}
      />
    </div>
  );
}
