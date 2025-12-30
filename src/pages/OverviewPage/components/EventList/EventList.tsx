import { eventRepository } from "../../../../db/eventRepository";
import { useLoadEvents } from "../../../../events/useEvents/useEventData/useLoadEvents/useLoadEvents";
import { useEventList } from "./useEventList/useEventList";
import { Pagination } from "../Pagination/Pagination";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./EventList.css";
import { useEventDataContext } from "../../../../events/useEvents/useEventDataContext/useEventDataContext";
import type { Event } from "../../../../db/scheduleDb";

export function EventList() {
  useLoadEvents(eventRepository);

  const { groupedEvents, formatTime, pagination } = useEventList();
  const { setEventData } = useEventDataContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEditClick = (event: Event) => {
    setEventData(event);
    navigate("/event/edit");
  };

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
                borderColor: event.color,
              }}
            >
              <div className="event-content">
                <div className="event-header">
                  <span className="event-title">
                    {(!event.id || event.recurrenceRule?.type !== "none") && (
                      <i
                        className="fa-solid fa-repeat"
                        style={{ marginRight: "8px" }}
                      ></i>
                    )}
                    {event.title}
                  </span>

                  <button
                    className="nav-button"
                    onClick={() => handleEditClick(event)}
                  >
                    <i
                      className="fa-solid fa-pen-to-square"
                      style={{ marginRight: "8px" }}
                    ></i>
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
