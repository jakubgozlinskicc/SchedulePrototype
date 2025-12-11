import "./schedulePage.css";
import { useEventsData } from "./useEvents/useEventsData";
import { useEventModal } from "./useEvents/useEventComponents/useEventModal";
import { useEventForm } from "./useEvents/useEventComponents/useEventForm";
import { useEventDropResize } from "./useEvents/useEventCalendar/useEventDropResize";
import { useEventHover } from "./useEvents/useEventComponents/useEventHover";
import { useSelectEvent } from "./useEvents/useEventCalendar/useSelectEvent";
import { useSelectSlot } from "./useEvents/useEventCalendar/useSelectSlot";
import { useCalendarLocale } from "./useEvents/useEventCalendar/useCalendarLocale";
import { EventModal } from "./components/eventModal/eventModal";
import { EventHover } from "./components/eventHover/eventHover";
import { useState } from "react";
import type { Event } from "../../db/scheduleDb";
import { Calendar, Views, type View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { CustomToolbar } from "./components/customToolbar/customToolbar";
import { calendarEventPropGetter } from "../../utils/calendarEventPropGetter";
import { useAddEvent } from "./useEvents/useEventCalendar/useAddEvent";
import type { Language } from "../../contexts/translationContext/translationContext";
import { useTranslationContext } from "../../locales/useTranslationContext";
import { useEventDataContext } from "./useEvents/useContext/useEventDataContext";
import { eventRepository } from "../../db/eventRepository";

const DnDCalendar = withDragAndDrop<Event, object>(Calendar);

function SchedulePage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const { eventData } = useEventDataContext();

  const { currentLanguage, changeLanguage } = useTranslationContext();

  const { localizer, formats } = useCalendarLocale();

  const { hoveredEvent, hoverPosition, handleMouseEnterEvent, clearHover } =
    useEventHover();

  const { isModalOpen, openModal, closeModal } = useEventModal();

  const { handleSelectEvent } = useSelectEvent(openModal, clearHover);

  const { events, deleteCurrentEvent, handleSubmit, updateEventTime } =
    useEventsData(closeModal, eventRepository);

  const { handleSelectSlot } = useSelectSlot(openModal);

  const { handleAddEvent } = useAddEvent(openModal);

  const { isShaking, handleChange } = useEventForm();

  const { handleEventDropResize } = useEventDropResize(updateEventTime);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    changeLanguage(event.target.value as Language);
  };

  return (
    <div className="schedule-page">
      <select
        className="language-select"
        value={currentLanguage}
        onChange={handleLanguageChange}
        style={{ marginLeft: "10px", padding: "5px" }}
      >
        <option value="enUS">EN</option>
        <option value="pl">PL</option>
      </select>
      <header className="schedule-header">
        <h1 className="schedule-title">Schedule</h1>
      </header>
      <section className="calendar-section" onMouseLeave={clearHover}>
        <DnDCalendar
          localizer={localizer}
          formats={formats}
          date={date}
          onNavigate={setDate}
          view={view}
          onView={setView}
          components={{
            toolbar: (toolbarProps) => (
              <CustomToolbar
                {...toolbarProps}
                onAddEvent={() => handleAddEvent()}
              />
            ),
            event: ({ event }) => (
              <div
                onMouseEnter={(mouseEvent) =>
                  handleMouseEnterEvent(event, mouseEvent)
                }
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
