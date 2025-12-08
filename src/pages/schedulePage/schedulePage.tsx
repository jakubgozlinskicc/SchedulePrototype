import "./schedulePage.css";
import { useEventsData } from "../../hooks/useEvents/useEventsData";
import { useEventModal } from "../../hooks/useEvents/useEventModal";
import { useEventForm } from "../../hooks/useEvents/useEventForm";
import { useCalendarHandlers } from "../../hooks/useEvents/useCalendarHandlers";
import { useEventHover } from "../../hooks/useEvents/useEventHover";
import { EventModal } from "../../components/eventModal/eventModal";
import { localizer } from "../../utils/calendarLocalizer";
import { formats } from "../../utils/dateFormats";
import { EventHover } from "../../components/eventHover/EventHover";
import { useState, type CSSProperties } from "react";
import type { Event } from "../../db/scheduleDb";
import { Calendar, Views, type View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { CustomToolbar } from "../../components/customToolbar/customToolbar";

const DnDCalendar = withDragAndDrop<Event, object>(Calendar);

function SchedulePage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const { hoveredEvent, hoverPosition, handleEventMouseEnter, clearHover } =
    useEventHover();

  const { isModalOpen, eventData, setEventData, openModal, closeModal } =
    useEventModal();

  const { events, deleteCurrentEvent, handleSubmit, updateEventTime } =
    useEventsData(eventData, closeModal);

  const { isShaking, handleChange } = useEventForm(setEventData);

  const { handleSelectSlot, handleSelectEvent, handleEventDropResize } =
    useCalendarHandlers(openModal, updateEventTime, clearHover);

  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <h1 className="schedule-title">Schedule</h1>
      </header>

      <section className="calendar-section">
        <DnDCalendar
          localizer={localizer}
          formats={formats}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          view={view}
          onView={(newView) => setView(newView)}
          components={{
            toolbar: (toolbarProps) => (
              <CustomToolbar {...toolbarProps} onAddEvent={() => openModal()} />
            ),
            event: ({ event }) => (
              <div
                onMouseEnter={(e) => handleEventMouseEnter(event as Event, e)}
                onMouseLeave={clearHover}
                style={{ height: "100%", cursor: "pointer" }}
              >
                {event.title}
              </div>
            ),
          }}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          selectable
          resizable
          dayLayoutAlgorithm="no-overlap"
          eventPropGetter={(event) => {
            const bg = event.color || "#591efd";
            const brightness = parseInt(bg.replace("#", ""), 16);
            const textColor = brightness > 0xffffff / 2 ? "black" : "white";

            return {
              className: "colored-event",
              style: {
                "--event-color": bg,
                color: textColor,
              } as CSSProperties,
            };
          }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDropResize}
          onEventResize={handleEventDropResize}
          style={{ height: "80vh", width: "80%" }}
        />
      </section>

      {hoveredEvent && (
        <EventHover event={hoveredEvent} position={hoverPosition} />
      )}
      {isModalOpen && (
        <EventModal
          eventData={eventData}
          isShaking={isShaking}
          onChange={handleChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onRequestDelete={deleteCurrentEvent}
        />
      )}
    </div>
  );
}

export default SchedulePage;
