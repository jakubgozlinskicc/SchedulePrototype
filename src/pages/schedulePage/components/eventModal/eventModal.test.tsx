import { render, screen } from "@testing-library/react";
import { EventModal } from "./eventModal";
import type { Event } from "../../../../db/scheduleDb";
import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";
import { vi, describe, beforeEach, it, expect } from "vitest";

let mockEventData: Event;

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../useEvents/useEventDataContext/useEventDataContext", () => ({
  useEventDataContext: () => ({
    eventData: mockEventData,
    setEventData: vi.fn(),
  }),
}));

vi.mock("./modalStrategy/modalRegistry", () => ({
  EventModalStrategyRegistry: {
    provideRenderer: vi.fn(),
  },
}));

describe("EventModal", () => {
  const mockEventDataWithoutId: Event = {
    title: "New Event",
    description: "New Description",
    start: new Date("2024-01-01T10:00"),
    end: new Date("2024-01-01T11:00"),
    color: "#3b82f6",
  };

  const mockEventDataWithId: Event = {
    id: 1,
    title: "Existing Event",
    description: "Existing Description",
    start: new Date("2024-01-01T10:00"),
    end: new Date("2024-01-01T11:00"),
    color: "#3b82f6",
  };

  const mockProps = {
    isShaking: false,
    onChange: vi.fn(),
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    onRequestDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockEventData = mockEventDataWithoutId;
  });

  it("It should call EventModalStrategyRegistry.provideRenderer with eventData", () => {
    const mockRenderer = {
      render: vi.fn().mockReturnValue(<div>Mock Modal</div>),
    };
    vi.mocked(EventModalStrategyRegistry.provideRenderer).mockReturnValue(
      mockRenderer
    );

    mockEventData = mockEventDataWithoutId;

    render(<EventModal {...mockProps} />);

    expect(EventModalStrategyRegistry.provideRenderer).toHaveBeenCalledWith(
      mockEventDataWithoutId
    );
  });

  it("It should render the result of strategy render method", () => {
    const mockRenderer = {
      render: vi.fn().mockReturnValue(<div>Test Content</div>),
    };
    vi.mocked(EventModalStrategyRegistry.provideRenderer).mockReturnValue(
      mockRenderer
    );

    mockEventData = mockEventDataWithoutId;

    render(<EventModal {...mockProps} />);

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("It should pass all commonProps to renderer.render", () => {
    const mockRenderer = {
      render: vi.fn().mockReturnValue(<div>Mock Modal</div>),
    };
    vi.mocked(EventModalStrategyRegistry.provideRenderer).mockReturnValue(
      mockRenderer
    );

    mockEventData = mockEventDataWithId;

    render(<EventModal {...mockProps} />);

    expect(mockRenderer.render).toHaveBeenCalledWith({
      ...mockProps,
      eventData: mockEventDataWithId,
    });
  });

  it("It should memoize renderer based on eventData", () => {
    const mockRenderer = {
      render: vi.fn().mockReturnValue(<div>Mock Modal</div>),
    };
    vi.mocked(EventModalStrategyRegistry.provideRenderer).mockReturnValue(
      mockRenderer
    );

    mockEventData = mockEventDataWithoutId;

    const { rerender } = render(<EventModal {...mockProps} />);

    expect(EventModalStrategyRegistry.provideRenderer).toHaveBeenCalledTimes(1);

    rerender(<EventModal {...mockProps} />);

    expect(EventModalStrategyRegistry.provideRenderer).toHaveBeenCalledTimes(1);
  });

  it("It should re-fetch renderer when eventData changes", () => {
    const mockRenderer = {
      render: vi.fn().mockReturnValue(<div>Mock Modal</div>),
    };
    vi.mocked(EventModalStrategyRegistry.provideRenderer).mockReturnValue(
      mockRenderer
    );

    mockEventData = mockEventDataWithoutId;

    const { rerender } = render(<EventModal {...mockProps} />);

    expect(EventModalStrategyRegistry.provideRenderer).toHaveBeenCalledTimes(1);

    mockEventData = mockEventDataWithId;

    rerender(<EventModal {...mockProps} />);

    expect(EventModalStrategyRegistry.provideRenderer).toHaveBeenCalledTimes(2);
  });

  it("It should handle different event types correctly", () => {
    const mockRendererAdd = {
      render: vi.fn().mockReturnValue(<div>Add Modal</div>),
    };
    const mockRendererEdit = {
      render: vi.fn().mockReturnValue(<div>Edit Modal</div>),
    };

    vi.mocked(EventModalStrategyRegistry.provideRenderer).mockReturnValueOnce(
      mockRendererAdd
    );

    mockEventData = mockEventDataWithoutId;

    const { rerender } = render(<EventModal {...mockProps} />);
    expect(screen.getByText("Add Modal")).toBeInTheDocument();

    vi.mocked(EventModalStrategyRegistry.provideRenderer).mockReturnValueOnce(
      mockRendererEdit
    );

    mockEventData = mockEventDataWithId;

    rerender(<EventModal {...mockProps} />);
    expect(screen.getByText("Edit Modal")).toBeInTheDocument();
  });
});
