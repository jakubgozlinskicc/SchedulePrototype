import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSubmitEvent } from "./useSubmitEvent";
import type { Event } from "../../../../db/scheduleDb";
import type { IEventRepository } from "../../IEventRepository";

let mockEventData: Event;
const mockReloadEvents = vi.fn();

vi.mock("../../useEventDataContext/useEventDataContext.ts", () => ({
  useEventDataContext: () => ({
    eventData: mockEventData,
  }),
}));

vi.mock("../useReloadEvents/useReloadEvents", () => ({
  useReloadEvents: () => ({
    reloadEvents: mockReloadEvents,
  }),
}));

vi.mock("./submitStrategies/SubmitStrategyRegistry", () => ({
  SubmitStrategyRegistry: {
    executeSubmit: vi.fn().mockResolvedValue(undefined),
  },
}));

import { SubmitStrategyRegistry } from "./submitStrategies/SubmitStrategyRegistry";

describe("useSubmitEvent", () => {
  let mockRepository: IEventRepository;
  let mockCloseModal: () => void;
  let mockFormEvent: React.FormEvent;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCloseModal = vi.fn();
    mockReloadEvents.mockResolvedValue(undefined);
    mockFormEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(undefined),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };

    mockEventData = {
      id: 1,
      title: "Test event",
      description: "Test description",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };
  });

  it("should call SubmitStrategyRegistry.executeSubmit with correct parameters", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.handleSubmit(mockFormEvent);
    });

    expect(SubmitStrategyRegistry.executeSubmit).toHaveBeenCalledWith(
      mockEventData,
      mockRepository
    );
  });

  it("should call reloadEvents after submitting event", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository)
    );
    await act(async () => {
      await result.current.handleSubmit(mockFormEvent);
    });

    expect(mockReloadEvents).toHaveBeenCalledTimes(1);
  });

  it("should call closeModal after submitting event", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository)
    );
    await act(async () => {
      await result.current.handleSubmit(mockFormEvent);
    });
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("should not close modal or reload events if an error occurs", async () => {
    (
      SubmitStrategyRegistry.executeSubmit as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("Submission failed"));

    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.handleSubmit(mockFormEvent);
    });

    expect(mockReloadEvents).not.toHaveBeenCalled();
    expect(mockCloseModal).not.toHaveBeenCalled();
  });
});
