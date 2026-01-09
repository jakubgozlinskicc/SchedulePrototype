import { eventRepository } from "../../../../db/eventRepository";
import { useLoadEvents } from "../../../../events/useEvents/useEventData/useLoadEvents/useLoadEvents";
import { useEventList } from "./useEventList/useEventList";
import { Pagination } from "../Pagination/Pagination";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./EventList.css";
import type { Event } from "../../../../db/scheduleDb";
import { Button } from "../../../../components/Button/Button";
import { DeleteEventConfirmation } from "../../../../events/form/DeleteEventConfirmation/DeleteEventConfirmation";
import { useEventDelete } from "./useEventList/useEventDelete/useEventDelete";

export function EventList() {
  useLoadEvents(eventRepository);

  const { groupedEvents, formatTime, pagination } = useEventList();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    eventToDelete,
    isRecurringEvent,
    handleDeleteClick,
    handleDeleteSingle,
    handleDeleteAll,
    handleCancelDelete,
  } = useEventDelete(eventRepository);

  const handleEditClick = (event: Event) => {
    const dateStr = encodeURIComponent(event.start.toISOString());
    if (!!event.id && event.recurrenceRule?.type !== "none") {
      navigate(`/recurring-event/edit/${event.id}/${dateStr}`);
    } else if (!event.id) {
      navigate(`/recurring-event/edit/${event.recurringEventId}/${dateStr}`);
    } else if (event.id) {
      navigate(`/event/edit/${event.id}`);
    }
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
      {eventToDelete && (
        <DeleteEventConfirmation
          onClose={handleCancelDelete}
          onConfirmSingle={handleDeleteSingle}
          onConfirmAll={handleDeleteAll}
        />
      )}

      {groupedEvents.map((group) => (
        <div key={group.dateKey} className="day-group">
          <div className="day-header">{group.dateLabel}</div>

          {group.events.map((event) => (
            <div
              key={
                event.id || `${event.recurringEventId}-${event.start.getTime()}`
              }
              className="event-item"
              style={{
                borderColor: event.color,
              }}
            >
              <div className="event-content">
                <div className="event-header">
                  <span className="event-title">
                    {isRecurringEvent(event) && (
                      <i className="fa-solid fa-repeat"></i>
                    )}
                    {event.title}
                  </span>
                  <div className="event-actions">
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(event)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                      {t("btn_delete")}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleEditClick(event)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      {t("edit")}
                    </Button>
                  </div>
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

      <Pagination {...pagination} />
    </div>
  );
}
