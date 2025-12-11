import "./schedulePage.css";
import { useEventModal } from "./useEvents/useEventComponents/useEventModal/useEventModal";
import { useEventUpdate } from "./useEvents/useEventComponents/useEventUpdate/useEventUpdate";
import { useEventDropResize } from "./useEvents/useEventCalendar/useEventDropResize/useEventDropResize";
import { useSelectEvent } from "./useEvents/useEventCalendar/useSelectEvent/useSelectEvent";
import { useSelectSlot } from "./useEvents/useEventCalendar/useSelectSlot/useSelectSlot";
import { useCalendarLocale } from "./useEvents/useEventCalendar/useCalendarLocale/useCalendarLocale";
import { useLoadEvents } from "./useEvents/useEventData/useLoadEvents/useLoadEvents";
import { useDeleteEvent } from "./useEvents/useEventData/useDeleteEvent/useDeleteEvent";
import { useSubmitEvent } from "./useEvents/useEventData/useSubmitEvent/useSubmitEvent";
import { useUpdateEventTime } from "./useEvents/useEventData/useUpdateEventTime/useUpdateEventTime";
import { EventModal } from "./components/eventModal/eventModal";
import { CalendarEvent } from "./components/calendarEvent/calendarEvent";
import { useState } from "react";
import type { Event } from "../../db/scheduleDb";
import { Calendar, Views, type View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { CustomToolbar } from "./components/customToolbar/customToolbar";
import { calendarEventPropGetter } from "../../utils/calendarEventPropGetter/calendarEventPropGetter";
import { useAddEvent } from "./useEvents/useEventData/useAddEvent/useAddEvent";
import type { Language } from "../../contexts/translationContext/translationContext";
import { useTranslationContext } from "../../locales/useTranslationContext";
import { useEventDataContext } from "./useEvents/useEventDataContext/useEventDataContext";
import { eventRepository } from "../../db/eventRepository";

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

  const { updateEventTime } = useUpdateEventTime(eventRepository);

  const { handleSelectSlot } = useSelectSlot(openModal);

  const { handleAddEvent } = useAddEvent(openModal);

  const { isShaking, handleChange } = useEventUpdate();

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
          style={{ height: "80vh", width: "80%" }}
        />
      </section>

      {isModalOpen && (
        <EventModal
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
