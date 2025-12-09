import "./schedulePage.css";
import { useEventsData } from "./useEvents/useEventsData";
import { useEventModal } from "./useEvents/useEventModal";
import { useEventForm } from "./useEvents/useEventForm";
import { useCalendarHandlers } from "./useEvents/useCalendarHandlers";
import { useEventHover } from "./useEvents/useEventHover";
import { useSelectEvent } from "./useEvents/useSelectEvent";
import { EventModal } from "./components/eventModal/eventModal";
import { localizer } from "../../utils/calendarLocalizer";
import { formats } from "../../utils/dateFormats";
import { EventHover } from "./components/eventHover/eventHover";
import { useState } from "react";
import type { Event } from "../../db/scheduleDb";
import { Calendar, Views, type View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { CustomToolbar } from "./components/customToolbar/customToolbar";
import { calendarEventPropGetter } from "../../utils/calendarEventPropGetter";

const DnDCalendar = withDragAndDrop<Event, object>(Calendar);

function SchedulePage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const { hoveredEvent, hoverPosition, handleMouseEnterEvent, clearHover } =
    useEventHover();

  const { isModalOpen, openModal, closeModal } = useEventModal();
  const { eventData, setEventData, handleSelectEvent, handleSelectSlot } =
    useSelectEvent(openModal, clearHover);
  const { events, deleteCurrentEvent, handleSubmit, updateEventTime } =
    useEventsData(eventData, closeModal);

  const { isShaking, handleChange } = useEventForm(setEventData);

  const { handleEventDropResize } = useCalendarHandlers(updateEventTime);

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
                onMouseEnter={(e) => handleMouseEnterEvent(event as Event, e)}
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
          eventPropGetter={calendarEventPropGetter}
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
