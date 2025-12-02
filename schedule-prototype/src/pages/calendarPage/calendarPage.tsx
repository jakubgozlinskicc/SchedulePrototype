import { Calendar, Views } from "react-big-calendar";
import { localizer } from "../../utils/calendarLocalizer";
import { useEvents } from "../../hooks/useEvents";

function CalendarPage() {
  const { events } = useEvents();

  return (
    <div style={{ height: "90vh", padding: 20 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        selectable
      />
    </div>
  );
}

export default CalendarPage;
