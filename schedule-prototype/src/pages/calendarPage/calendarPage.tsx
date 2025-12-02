import { Calendar, Views, type SlotInfo } from "react-big-calendar";
import { localizer } from "../../utils/calendarLocalizer";
import { useEvents } from "../../hooks/useEvents";

function CalendarPage() {
  const { events, eventData, openAddModal } = useEvents();

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const { start, end } = slotInfo;

    openAddModal({
      ...eventData,
      start: start as Date,
      end: end as Date,
    });
  };

  return (
    <div style={{ height: "90vh", padding: 20 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        selectable
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
}

export default CalendarPage;
