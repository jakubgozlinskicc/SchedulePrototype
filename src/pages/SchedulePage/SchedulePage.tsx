import "./SchedulePage.css";
import { useEventModal } from "./components/EventModal/useEventModal/useEventModal";
import { useEventDropResize } from "./useEvents/useEventCalendar/useEventDropResize/useEventDropResize";
import { useSelectEvent } from "./useEvents/useEventCalendar/useSelectEvent/useSelectEvent";
import { useSelectSlot } from "./useEvents/useEventCalendar/useSelectSlot/useSelectSlot";
import { useCalendarLocale } from "./useEvents/useEventCalendar/useCalendarLocale/useCalendarLocale";
import { useLoadEvents } from "./useEvents/useEventData/useLoadEvents/useLoadEvents";
import { useDeleteEvent } from "./useEvents/useEventData/useDeleteEvent/useDeleteEvent";
import { EventModal } from "./components/EventModal/EventModal";
import { CalendarEvent } from "./components/CalendarEvent/CalendarEvent";
import { useState } from "react";
import type { Event } from "../../db/scheduleDb";
import { Calendar, Views, type View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { CustomToolbar } from "./components/CustomToolbar/components/CustomToolbar";
import { calendarEventPropGetter } from "../../utils/calendarEventPropGetter/calendarEventPropGetter";
import { useAddEvent } from "./useEvents/useEventData/useAddEvent/useAddEvent";
import { useEventDataContext } from "./useEvents/useEventDataContext/useEventDataContext";
import { eventRepository } from "../../db/eventRepository";
import { EventDataProvider } from "./eventContext/eventDataProvider";
import { PageHeader } from "../../components/PageHeader/PageHeader";

const DnDCalendar = withDragAndDrop<Event, object>(Calendar);

function SchedulePageContent() {
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
      <PageHeader title="schedule" icon="fa-regular fa-calendar" />
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

function SchedulePage() {
  return (
    <EventDataProvider>
      <SchedulePageContent />
    </EventDataProvider>
  );
}

export default SchedulePage;
