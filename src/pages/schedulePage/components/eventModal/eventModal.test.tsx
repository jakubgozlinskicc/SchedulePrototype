import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventModal } from "./eventModal";
import type { IEventRepository } from "../../../../events/useEvents/IEventRepository";
import type { Event } from "../../../../db/scheduleDb";

const mockOnSubmit = vi.fn();
const mockHandleEditSingle = vi.fn();
const mockHandleEditAll = vi.fn();

let mockEventData: Event | null = null;

vi.mock(
  "../../../../events/useEvents/useEventDataContext/useEventDataContext",
  () => ({
    useEventDataContext: () => ({
      eventData: mockEventData,
    }),
  })
);

vi.mock(
  "../../../../events/useEvents/useEventData/useSubmitEvent/useSubmitEvent",
  () => ({
    useSubmitEvent: () => ({
      onSubmit: mockOnSubmit,
    }),
  })
);

vi.mock(
  "../../../../events/useEvents/useEventData/useRecurringEdit/useRecurringEdit",
  () => ({
    useRecurringEdit: () => ({
      handleEditSingle: mockHandleEditSingle,
      handleEditAll: mockHandleEditAll,
    }),
  })
);

const mockRender = vi
  .fn()
  .mockReturnValue(<div data-testid="modal-content">Modal Content</div>);

vi.mock("./modalStrategy/modalRegistry", () => ({
  EventModalStrategyRegistry: {
    provideRenderer: vi.fn().mockReturnValue({
      render: (props: unknown) => mockRender(props),
    }),
  },
}));

import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";

describe("EventModal", () => {
  let mockRepository: IEventRepository;
  let mockOnClose: () => void;
  let mockOnRequestDelete: () => void;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(undefined),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };

    mockOnClose = vi.fn();
    mockOnRequestDelete = vi.fn();

    mockEventData = {
      id: 1,
      title: "Test Event",
      description: "Test Description",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    mockRender.mockReturnValue(
      <div data-testid="modal-content">Modal Content</div>
    );
  });

  it("should render modal content from strategy", () => {
    render(
      <EventModal
        repository={mockRepository}
        onClose={mockOnClose}
        onRequestDelete={mockOnRequestDelete}
      />
    );

    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
  });

  it("should call provideRenderer with eventData", () => {
    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(EventModalStrategyRegistry.provideRenderer).toHaveBeenCalledWith(
      mockEventData
    );
  });

  it("should pass eventData to renderer", () => {
    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        eventData: mockEventData,
      })
    );
  });

  it("should pass onClose to renderer", () => {
    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        onClose: mockOnClose,
      })
    );
  });

  it("should pass onSubmit to renderer", () => {
    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        onSubmit: mockOnSubmit,
      })
    );
  });

  it("should pass onRequestDelete to renderer when provided", () => {
    render(
      <EventModal
        repository={mockRepository}
        onClose={mockOnClose}
        onRequestDelete={mockOnRequestDelete}
      />
    );

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        onRequestDelete: mockOnRequestDelete,
      })
    );
  });

  it("should pass onEditSingle to renderer", () => {
    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        onEditSingle: mockHandleEditSingle,
      })
    );
  });

  it("should pass onEditAll to renderer", () => {
    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        onEditAll: mockHandleEditAll,
      })
    );
  });

  it("should render without onRequestDelete", () => {
    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        onRequestDelete: undefined,
      })
    );
  });

  it("should handle null eventData", () => {
    mockEventData = null;

    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(EventModalStrategyRegistry.provideRenderer).toHaveBeenCalledWith(
      null
    );
  });

  it("should render recurring event modal", () => {
    mockEventData = {
      id: 1,
      title: "Recurring Event",
      description: "Test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(EventModalStrategyRegistry.provideRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: { type: "daily", interval: 1 },
      })
    );
  });

  it("should render virtual occurrence modal", () => {
    mockEventData = {
      title: "Virtual Occurrence",
      description: "Test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurringEventId: 5,
    };

    render(<EventModal repository={mockRepository} onClose={mockOnClose} />);

    expect(EventModalStrategyRegistry.provideRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        recurringEventId: 5,
      })
    );
  });

  it("should pass all props to renderer in single call", () => {
    render(
      <EventModal
        repository={mockRepository}
        onClose={mockOnClose}
        onRequestDelete={mockOnRequestDelete}
      />
    );

    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledWith({
      eventData: mockEventData,
      onClose: mockOnClose,
      onSubmit: mockOnSubmit,
      onRequestDelete: mockOnRequestDelete,
      onEditSingle: mockHandleEditSingle,
      onEditAll: mockHandleEditAll,
    });
  });
});
