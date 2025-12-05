import "./schedulePage.css";
import { useEvents } from "../../hooks/useEvents";
import { EventModal } from "../../components/eventModal";
import { localizer } from "../../utils/calendarLocalizer";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type CSSProperties,
} from "react";
import type { Event } from "../../db/scheduleDb";
import { Calendar, Views, type SlotInfo, type View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { CustomToolbar } from "../../components/customToolbar";

const DnDCalendar = withDragAndDrop<Event, object>(Calendar);

function SchedulePage() {
  const [isShaking, setIsShaking] = useState(false);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");
  const {
    events,
    isModalOpen,
    editingEventId,
    isEditingMode,
    eventData,
    setEventData,
    openModal,
    closeModal,
    beginEditCurrentEvent,
    handleAddEvent,
    handleUpdateEvent,
    deleteCurrentEvent,
    updateEventTime,
  } = useEvents();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

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

    openModal({
      start: start,
      end: end,
    });
  };

  const handleSelectEvent = (event: Event) => {
    openModal(event);
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
      </header>

      <section className="calendar-section">
        <DnDCalendar
          localizer={localizer}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          view={view}
          onView={(newView) => setView(newView)}
          components={{
            toolbar: (toolbarProps) => (
              <CustomToolbar {...toolbarProps} onAddEvent={() => openModal()} />
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
          onSelectEvent={(ev) => handleSelectEvent(ev as Event)}
          onEventDrop={handleEventDropResize}
          onEventResize={handleEventDropResize}
          style={{ height: "80vh", width: "80%" }}
        />
      </section>

      <EventModal
        isOpen={isModalOpen}
        editingEventId={editingEventId}
        isEditingMode={isEditingMode}
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
