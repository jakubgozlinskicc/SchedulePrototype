import { it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SchedulePage from "./SchedulePage";

const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: null }),
}));

vi.mock("../../db/eventRepository", () => ({
  eventRepository: {
    getEvents: vi.fn().mockResolvedValue([]),
    addEvent: vi.fn(),
    editEvent: vi.fn(),
    deleteEvent: vi.fn(),
    getEventById: vi.fn(),
    clearEvents: vi.fn(),
  },
}));

vi.mock("react-big-calendar", () => ({
  Calendar: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="calendar">{children}</div>
  ),
  Views: { MONTH: "month", WEEK: "week", DAY: "day" },
  dateFnsLocalizer: () => ({}),
}));

vi.mock("react-big-calendar/lib/addons/dragAndDrop", () => ({
  default: (Calendar: React.ComponentType) => Calendar,
}));

vi.mock("../../components/PageHeader/PageHeader", () => ({
  PageHeader: ({ title, icon }: { title: string; icon?: string }) => (
    <header data-testid="page-header">
      {icon && <i className={icon}></i>}
      <h1>{title}</h1>
    </header>
  ),
}));

vi.mock("../../components/TopControls/TopControls", () => ({
  TopControls: ({
    children,
    buttonText,
  }: {
    children: React.ReactNode;
    buttonText: string;
  }) => (
    <div data-testid="top-controls">
      <button>{buttonText}</button>
      {children}
    </div>
  ),
}));

vi.mock("./components/EventModal/EventModal", () => ({
  EventModal: () => <div data-testid="event-modal">EventModal</div>,
}));

vi.mock("./components/CustomToolbar/components/CustomToolbar", () => ({
  CustomToolbar: () => <div data-testid="custom-toolbar">CustomToolbar</div>,
}));

vi.mock("./components/CalendarEvent/CalendarEvent", () => ({
  CalendarEvent: () => <div data-testid="calendar-event">CalendarEvent</div>,
}));

const mockUseEventModal = vi.fn();

vi.mock("./components/EventModal/useEventModal/useEventModal", () => ({
  useEventModal: () => mockUseEventModal(),
}));

vi.mock(
  "./useEvents/useEventCalendar/useEventDropResize/useEventDropResize",
  () => ({
    useEventDropResize: () => ({ handleEventDropResize: vi.fn() }),
  })
);

vi.mock("./useEvents/useEventCalendar/useSelectEvent/useSelectEvent", () => ({
  useSelectEvent: () => ({ handleSelectEvent: vi.fn() }),
}));

vi.mock("./useEvents/useEventCalendar/useSelectSlot/useSelectSlot", () => ({
  useSelectSlot: () => ({ handleSelectSlot: vi.fn() }),
}));

vi.mock(
  "./useEvents/useEventCalendar/useCalendarLocale/useCalendarLocale",
  () => ({
    useCalendarLocale: () => ({ localizer: {}, formats: {} }),
  })
);

vi.mock("./useEvents/useEventData/useLoadEvents/useLoadEvents", () => ({
  useLoadEvents: vi.fn(),
}));

vi.mock("./useEvents/useEventData/useDeleteEvent/useDeleteEvent", () => ({
  useDeleteEvent: () => ({ deleteCurrentEvent: vi.fn() }),
}));

vi.mock("./useEvents/useEventData/useAddEvent/useAddEvent", () => ({
  useAddEvent: () => ({ handleAddEvent: vi.fn() }),
}));

vi.mock("./useEvents/useEventDataContext/useEventDataContext", () => ({
  useEventDataContext: () => ({
    events: [],
    setEvents: vi.fn(),
    reloadEvents: vi.fn(),
  }),
}));

vi.mock("./eventContext/eventDataProvider", () => ({
  EventDataProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseEventModal.mockReturnValue({
    isModalOpen: false,
    openModal: vi.fn(),
    closeModal: vi.fn(),
  });
});

it("should render the schedule page", () => {
  render(<SchedulePage />);
  expect(screen.getByTestId("page-header")).toBeInTheDocument();
});

it("should render page header with correct title", () => {
  render(<SchedulePage />);
  expect(screen.getByText("schedule")).toBeInTheDocument();
});

it("should render top controls component", () => {
  render(<SchedulePage />);
  expect(screen.getByTestId("top-controls")).toBeInTheDocument();
});

it("should render overview button in top controls", () => {
  render(<SchedulePage />);
  expect(screen.getByText("overview")).toBeInTheDocument();
});

it("should render calendar component", () => {
  render(<SchedulePage />);
  expect(screen.getByTestId("calendar")).toBeInTheDocument();
});

it("should not render event modal when isModalOpen is false", () => {
  mockUseEventModal.mockReturnValue({
    isModalOpen: false,
    openModal: vi.fn(),
    closeModal: vi.fn(),
  });

  render(<SchedulePage />);
  expect(screen.queryByTestId("event-modal")).not.toBeInTheDocument();
});

it("should render event modal when isModalOpen is true", () => {
  mockUseEventModal.mockReturnValue({
    isModalOpen: true,
    openModal: vi.fn(),
    closeModal: vi.fn(),
  });

  render(<SchedulePage />);
  expect(screen.getByTestId("event-modal")).toBeInTheDocument();
});

it("should have calendar section with correct class", () => {
  render(<SchedulePage />);
  const calendarSection = document.querySelector(".calendar-section");
  expect(calendarSection).toBeInTheDocument();
});

it("should have schedule-page container class", () => {
  render(<SchedulePage />);
  const schedulePage = document.querySelector(".schedule-page");
  expect(schedulePage).toBeInTheDocument();
});
