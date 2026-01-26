import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventList } from "./EventList";
import type { Event } from "../../../../db/scheduleDb";

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Meeting",
    description: "Team meeting",
    start: new Date("2025-12-30T10:00:00"),
    end: new Date("2025-12-30T11:00:00"),
    color: "#0000FF",
    recurrenceRule: { type: "none", interval: 1 },
  },
  {
    id: 2,
    title: "Recurring Event",
    description: "Daily standup",
    start: new Date("2025-12-31T09:00:00"),
    end: new Date("2025-12-31T09:30:00"),
    color: "#FF0000",
    recurrenceRule: { type: "daily", interval: 1 },
  },
];

let mockEventsData = mockEvents;
const mockNavigate = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "no-upcoming-events": "No upcoming events",
        edit: "Edit",
        btn_delete: "Delete",
        today: "Today",
        tomorrow: "Tomorrow",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("./useEventList/useLoadEvents/useLoadEvents", () => ({
  useLoadEvents: vi.fn(() => ({
    events: mockEventsData,
  })),
}));

vi.mock("./useEventList/useEventList", () => ({
  useEventList: vi.fn(() => ({
    groupedEvents:
      mockEventsData.length > 0
        ? [
            {
              dateKey: "2025-12-30",
              dateLabel: "Today",
              events: mockEventsData,
            },
          ]
        : [],
    formatTime: (date: Date) => {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    pagination: {
      currentPage: 1,
      totalPages: Math.ceil(mockEventsData.length / 10),
      setCurrentPage: vi.fn(),
    },
  })),
}));

vi.mock("../../../../components/Confirmation/Confirmation", () => ({
  Confirmation: ({
    variant,
    titleKey,
    buttons,
  }: {
    variant: string;
    titleKey: string;
    descKey: string;
    buttons: Array<{
      label: string;
      variant: string;
      onClick: () => void;
    }>;
  }) => (
    <div data-testid={`confirmation-${variant}`}>
      <span>{titleKey}</span>
      {buttons.map((btn, index) => (
        <button key={index} onClick={btn.onClick} data-variant={btn.variant}>
          {btn.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("./useEventList/useEventDelete/useEventDelete", () => ({
  useEventDelete: vi.fn(() => ({
    eventToDelete: null,
    isRecurringEvent: vi.fn((event) => event.recurrenceRule.type !== "none"),
    handleDeleteClick: vi.fn(),
    handleDeleteSingle: vi.fn(),
    handleDeleteAll: vi.fn(),
    handleCancelDelete: vi.fn(),
  })),
}));

describe("EventList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEventsData = mockEvents;
  });

  it("should render no events message when list is empty", () => {
    mockEventsData = [];

    render(<EventList />);

    expect(screen.getByText("No upcoming events")).toBeInTheDocument();
  });

  it("should render list of events", () => {
    render(<EventList />);

    expect(screen.getByText("Meeting")).toBeInTheDocument();
    expect(screen.getByText("Recurring Event")).toBeInTheDocument();
  });

  it("should display event description", () => {
    render(<EventList />);

    expect(screen.getByText("Team meeting")).toBeInTheDocument();
    expect(screen.getByText("Daily standup")).toBeInTheDocument();
  });

  it("should show recurring icon for recurring events", () => {
    const { container } = render(<EventList />);

    const repeatIcons = container.querySelectorAll(".fa-repeat");
    expect(repeatIcons.length).toBeGreaterThan(0);
  });

  it("should apply event color to border", () => {
    const { container } = render(<EventList />);

    const eventItems = container.querySelectorAll(".event-item");
    const firstEvent = eventItems[0] as HTMLElement;

    expect(firstEvent.style.borderColor).toBe("rgb(0, 0, 255)");
  });

  it("should call navigate when edit button clicked", () => {
    render(<EventList />);

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/event/edit/1");
  });

  it("should render day headers", () => {
    render(<EventList />);

    const dayHeaders = document.querySelectorAll(".day-header");
    expect(dayHeaders.length).toBeGreaterThan(0);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("should render pagination when more than 10 events", () => {
    const manyEvents = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `Event ${i + 1}`,
      description: "",
      start: new Date(`2025-12-30T${10 + i}:00:00`),
      end: new Date(`2025-12-30T${11 + i}:00:00`),
      color: "#0000FF",
      recurrenceRule: { type: "none" as const, interval: 1 },
    }));

    mockEventsData = manyEvents;

    const { container } = render(<EventList />);

    expect(container.querySelector(".pagination")).toBeInTheDocument();
  });

  it("should not render pagination when 10 or fewer events", () => {
    const { container } = render(<EventList />);

    expect(container.querySelector(".pagination")).not.toBeInTheDocument();
  });
});
