import { eventRepository } from "../../../../db/eventRepository";
import { useEventList } from "./useEventList/useEventList";
import { Pagination } from "../Pagination/Pagination";
import { useTranslation } from "react-i18next";
import "./EventList.css";
import { Button } from "../../../../components/Button/Button";
import { useEventDelete } from "./useEventList/useEventDelete/useEventDelete";
import { useLoadEvents } from "./useEventList/useLoadEvents/useLoadEvents";
import { RecurringEventConfirmation } from "../../../../events/Confirmations/RecurringEventConfirmation/RecurringEventConfirmation";
import { RegularEventConfirmation } from "../../../../events/Confirmations/RegularEventConfirmation/RegularEventConfirmation";
import { useEventNavigation } from "./useEventList/useEventNavigation/useEventNavigation";

export function EventList() {
  const { events, reloadEvents } = useLoadEvents(eventRepository);

  const { groupedEvents, formatTime, pagination } = useEventList(events);
  const { t } = useTranslation();

  const {
    eventToDelete,
    isDeleteModalOpen,
    isRecurringEvent,
    handleDeleteClick,
    handleDeleteSingle,
    handleDeleteAll,
    handleCancelDelete,
    closeDeleteModal,
  } = useEventDelete(eventRepository, reloadEvents);

  const { handleEditClick } = useEventNavigation();

  if (groupedEvents.length === 0) {
    return (
      <div className="events-list">
        <p className="no-events">{t("no-upcoming-events")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="events-list">
        {eventToDelete && isRecurringEvent(eventToDelete) && (
          <RecurringEventConfirmation
            variant="delete"
            onClose={handleCancelDelete}
            onConfirmSingle={handleDeleteSingle}
            onConfirmAll={handleDeleteAll}
          />
        )}

        {isDeleteModalOpen && (
          <RegularEventConfirmation
            variant="delete"
            onClose={closeDeleteModal}
            onConfirm={handleDeleteSingle}
          />
        )}

        {groupedEvents.map((group) => (
          <div key={group.dateKey} className="day-group">
            <div className="day-header">{group.dateLabel}</div>

            {group.events.map((event) => (
              <div
                key={
                  event.id ||
                  `${event.recurringEventId}-${event.start.getTime()}`
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
      </div>
      <Pagination {...pagination} />
    </>
  );
}
