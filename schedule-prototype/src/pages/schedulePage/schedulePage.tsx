import "./schedulePage.css";
import { useEvents } from "../../hooks/useEvents";
import { EventModal } from "../../components/eventModal";
import type { ChangeEvent, FormEvent } from "react";
import type { Event } from "../../db/scheduleDb";

function SchedulePage() {
  const {
    events,
    isModalOpen,
    editingEventId,
    eventData,
    setEventData,
    openAddModal,
    openEditModal,
    closeModal,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
  } = useEvents();

  const handleSubmit = (e: FormEvent) => {
    if (editingEventId === null) {
      handleAddEvent(e);
    } else {
      handleUpdateEvent(e);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      const date = value ? new Date(value) : new Date();
      setEventData((prev) => ({
        ...prev,
        [name]: date,
      }));
      return;
    }

    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (event: Event) => {
    openEditModal(event);
  };

  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <h1 className="schedule-title">Harmonogram</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          Dodaj wydarzenie
        </button>
      </header>

      <section className="events-section">
        <h2 className="section-title">Twoje wydarzenia</h2>

        {events.length === 0 && (
          <p className="events-list">Brak wydarzeń. Dodaj pierwsze</p>
        )}

        <ul className="events-list">
          {events.map((event) => (
            <li key={event.id} className="event-item">
              <div className="event-main">
                <span
                  className="event-color-dot"
                  style={{ backgroundColor: event.color }}
                />
                <div>
                  <div className="event-title">{event.title}</div>
                  <div className="event-dates">
                    {event.start.toLocaleString()} –{" "}
                    {event.end.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="event-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditClick(event)}
                >
                  Edytuj
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteEvent(event)}
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <EventModal
        isOpen={isModalOpen}
        editingEventId={editingEventId}
        eventData={eventData}
        onChange={handleChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default SchedulePage;
