import "./schedulePage.css";
import { useEventModal } from "./useEvents/useEventComponents/useEventModal/useEventModal";
import { useEventDropResize } from "./useEvents/useEventCalendar/useEventDropResize/useEventDropResize";
import { useSelectEvent } from "./useEvents/useEventCalendar/useSelectEvent/useSelectEvent";
import { useSelectSlot } from "./useEvents/useEventCalendar/useSelectSlot/useSelectSlot";
import { useCalendarLocale } from "./useEvents/useEventCalendar/useCalendarLocale/useCalendarLocale";
import { useLoadEvents } from "../../events/useEvents/useEventData/useLoadEvents/useLoadEvents";
import { useDeleteEvent } from "../../events/useEvents/useEventData/useDeleteEvent/useDeleteEvent";
import { EventModal } from "./components/eventModal/eventModal";
import { CalendarEvent } from "./components/calendarEvent/calendarEvent";
import { useState } from "react";
import type { Event } from "../../db/scheduleDb";
import { Calendar, Views, type View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { CustomToolbar } from "./components/customToolbar/components/customToolbar";
import { calendarEventPropGetter } from "../../utils/calendarEventPropGetter/calendarEventPropGetter";
import { useAddEvent } from "../../events/useEvents/useEventData/useAddEvent/useAddEvent";
import { useEventDataContext } from "../../events/useEvents/useEventDataContext/useEventDataContext";
import { eventRepository } from "../../db/eventRepository";
import { TopControls } from "../../components/TopControls/TopControls";

const DnDCalendar = withDragAndDrop<Event, object>(Calendar);

function SchedulePage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const { events } = useEventDataContext();
  const { localizer, formats } = useCalendarLocale();
  const { isModalOpen, openModal, closeModal } = useEventModal();

  useLoadEvents(eventRepository);

  const { deleteCurrentEvent } = useDeleteEvent(closeModal, eventRepository);
  const { handleSelectEvent } = useSelectEvent(openModal);
  const { handleSelectSlot } = useSelectSlot(openModal);
  const { handleAddEvent } = useAddEvent(openModal);
  const { handleEventDropResize } = useEventDropResize(eventRepository);

  return (
    <div className="schedule-page">
      <TopControls
        buttonText="Overview"
        buttonIcon="fa-solid fa-list"
        navigateTo="/overview"
      />
      <header className="schedule-header">
        <h1 className="schedule-title">
          Schedule
          <i
            className="fa-regular fa-calendar"
            style={{ marginLeft: "8px" }}
          ></i>
        </h1>
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
          onClose={closeModal}
          onRequestDelete={deleteCurrentEvent}
        />
      )}
    </div>
  );
}

export default SchedulePage;
