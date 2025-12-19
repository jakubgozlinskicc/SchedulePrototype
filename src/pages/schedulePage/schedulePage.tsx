import "./schedulePage.css";
import { useEventModal } from "./useEvents/useEventComponents/useEventModal/useEventModal";
import { useEventUpdate } from "./useEvents/useEventComponents/useEventUpdate/useEventUpdate";
import { useEventDropResize } from "./useEvents/useEventCalendar/useEventDropResize/useEventDropResize";
import { useSelectEvent } from "./useEvents/useEventCalendar/useSelectEvent/useSelectEvent";
import { useSelectSlot } from "./useEvents/useEventCalendar/useSelectSlot/useSelectSlot";
import { useCalendarLocale } from "./useEvents/useEventCalendar/useCalendarLocale/useCalendarLocale";
import { useLoadEvents } from "../../events/useEvents/useEventData/useLoadEvents/useLoadEvents";
import { useDeleteEvent } from "../../events/useEvents/useEventData/useDeleteEvent/useDeleteEvent";
import { useSubmitEvent } from "../../events/useEvents/useEventData/useSubmitEvent/useSubmitEvent";
import { EventModal } from "./components/eventModal/eventModal";
import { CalendarEvent } from "./components/calendarEvent/calendarEvent";
import { useState } from "react";
import type { Event } from "../../db/scheduleDb";
import { Calendar, Views, type View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { CustomToolbar } from "./components/customToolbar/components/customToolbar";
import { calendarEventPropGetter } from "../../utils/calendarEventPropGetter/calendarEventPropGetter";
import { useAddEvent } from "../../events/useEvents/useEventData/useAddEvent/useAddEvent";
import type { Language } from "../../contexts/translationContext/translationContext";
import { useTranslationContext } from "../../locales/useTranslationContext";
import { useEventDataContext } from "../../events/useEvents/useEventDataContext/useEventDataContext";
import { eventRepository } from "../../db/eventRepository";
import { useNavigate } from "react-router-dom";

const DnDCalendar = withDragAndDrop<Event, object>(Calendar);

function SchedulePage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const { events } = useEventDataContext();

  const { currentLanguage, changeLanguage } = useTranslationContext();

  const { localizer, formats } = useCalendarLocale();

  const { isModalOpen, openModal, closeModal } = useEventModal();

  const { handleSelectEvent } = useSelectEvent(openModal);

  useLoadEvents(eventRepository);

  const { deleteCurrentEvent } = useDeleteEvent(closeModal, eventRepository);

  const { handleSubmit } = useSubmitEvent(closeModal, eventRepository);

  const { handleSelectSlot } = useSelectSlot(openModal);

  const { handleAddEvent } = useAddEvent(openModal);

  const { isShaking, handleChange } = useEventUpdate();

  const { handleEventDropResize } = useEventDropResize(eventRepository);

  const navigate = useNavigate();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    changeLanguage(event.target.value as Language);
  };

  return (
    <div className="schedule-page">
      <div className="top-controls">
        <button
          className="overview-button"
          onClick={() => navigate("/overview")}
        >
          Overview
        </button>
        <select
          className="language-select"
          value={currentLanguage}
          onChange={handleLanguageChange}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value="enUS">EN</option>
          <option value="pl">PL</option>
        </select>
      </div>
      <header className="schedule-header">
        <h1 className="schedule-title">Schedule</h1>
      </header>
      <section className="calendar-section">
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
            event: ({ event }) => <CalendarEvent event={event} />,
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
          style={{ height: "80vh", width: "100%" }}
        />
      </section>

      {isModalOpen && (
        <EventModal
          repository={eventRepository}
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
