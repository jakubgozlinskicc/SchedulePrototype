import "./schedulePage.css";

import { useEvents } from "../../hooks/useEvents";
import { EventModal } from "../../components/eventModal";
import { localizer } from "../../utils/calendarLocalizer";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Event } from "../../db/scheduleDb";
import { Calendar, Views, type SlotInfo } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import { CustomToolbar } from "../../components/customToolbar";

const DnDCalendar = withDragAndDrop<Event, object>(Calendar);

function SchedulePage() {
  const [isShaking, setIsShaking] = useState(false);
  const {
    events,
    isModalOpen,
    editingEventId,
    eventData,
    modalMode,
    setEventData,
    openAddModal,
    openEditModal,
    closeModal,
    beginEditCurrentEvent,
    handleAddEvent,
    handleUpdateEvent,
    deleteCurrentEvent,
    updateEventTime,
  } = useEvents();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!eventData.title.trim()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      return;
    }

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
      const newDate = value ? new Date(value) : new Date();

      setEventData((prev) => {
        const updated = { ...prev, [name]: newDate };

        if (name === "start" && newDate > prev.end) {
          updated.end = newDate;
        }

        if (name === "end" && newDate < prev.start) {
          updated.end = prev.start;
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 300);
        }

        return updated;
      });

      return;
    }
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const { start, end } = slotInfo;

    openAddModal({
      ...eventData,
      start: start as Date,
      end: end as Date,
    });
  };

  const handleSelectEvent = (event: Event) => {
    openEditModal(event);
  };

  type DragDropArgs = {
    event: Event;
    start: Date | string;
    end: Date | string;
    allDay?: boolean;
  };

  const handleEventDropResize = async ({ event, start, end }: DragDropArgs) => {
    if (!event.id) return;

    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);

    await updateEventTime(event.id, startDate, endDate);
  };

  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <h1 className="schedule-title">Schedule</h1>
        <button className="btn btn-primary" onClick={() => openAddModal()}>
          Dodaj wydarzenie
        </button>
      </header>

      <section className="calendar-section">
        <DnDCalendar
          localizer={localizer}
          components={{
            toolbar: CustomToolbar,
          }}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          selectable
          resizable
          eventPropGetter={(event) => {
            const bg = event.color;

            const brightness = parseInt(bg.replace("#", ""), 16);
            const textColor = brightness > 0xffffff / 2 ? "black" : "white";

            return {
              style: {
                backgroundColor: bg,
                color: textColor,
                borderRadius: "6px",
                border: "none",
              },
            };
          }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(ev) => handleSelectEvent(ev as Event)}
          onEventDrop={handleEventDropResize}
          onEventResize={handleEventDropResize}
          style={{ height: "80vh", width: "80%" }}
        />
      </section>

      {/* <section className="events-section">
        <h2 className="section-title">Twoje wydarzenia</h2>

        {events.length === 0 && (
          <p className="events-empty">Brak wydarzeń. Dodaj pierwsze 😊</p>
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
                  className="btn btn-secondary btn-sm"
                  onClick={() => openEditModal(event)}
                >
                  Edytuj
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteEvent(event)}
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section> */}
      <EventModal
        isOpen={isModalOpen}
        mode={modalMode}
        editingEventId={editingEventId}
        eventData={eventData}
        isShaking={isShaking}
        onChange={handleChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onRequestEdit={beginEditCurrentEvent}
        onRequestDelete={deleteCurrentEvent}
      />
    </div>
  );
}

export default SchedulePage;
