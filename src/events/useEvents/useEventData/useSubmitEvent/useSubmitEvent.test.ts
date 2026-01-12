import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSubmitEvent } from "./useSubmitEvent";
import type { Event } from "../../../../db/scheduleDb";
import type { IEventRepository } from "../../IEventRepository";
import type { EventFormData } from "../../../../events/form/EventForm/eventFormSchema";

let mockIsEditAll = false;
const mockReloadEvents = vi.fn();
const mockSetIsEditAll = vi.fn();

vi.mock("../../useEventDataContext/useEventDataContext.ts", () => ({
  useEventDataContext: () => ({
    isEditAll: mockIsEditAll,
    setIsEditAll: mockSetIsEditAll,
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
  let mockFormData: EventFormData;
  let mockEvent: Event;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCloseModal = vi.fn();
    mockReloadEvents.mockResolvedValue(undefined);
    mockIsEditAll = false;

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(undefined),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };

    mockEvent = {
      id: 1,
      title: "Test event",
      description: "Test description",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    mockFormData = {
      title: "Test event",
      description: "Test description",
      start: "2025-12-10T10:00",
      end: "2025-12-10T11:00",
      color: "#0000FF",
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceEndType: "never",
      recurrenceEndDate: undefined,
      recurrenceCount: undefined,
    };
  });

  it("should call SubmitStrategyRegistry.executeSubmit with correct parameters", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(SubmitStrategyRegistry.executeSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      mockRepository,
      { isEditAll: false }
    );
  });

  it("should pass isEditAll true when editing all occurrences", async () => {
    mockIsEditAll = true;

    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(SubmitStrategyRegistry.executeSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      mockRepository,
      { isEditAll: true }
    );
  });

  it("should call reloadEvents after submitting event", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockReloadEvents).toHaveBeenCalledTimes(1);
  });

  it("should reset isEditAll to false after submitting", async () => {
    mockIsEditAll = true;

    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockSetIsEditAll).toHaveBeenCalledWith(false);
  });

  it("should call closeModal after submitting event", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("should not close modal, reload events or reset isEditAll if an error occurs", async () => {
    (
      SubmitStrategyRegistry.executeSubmit as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("Submission failed"));

    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockReloadEvents).not.toHaveBeenCalled();
    expect(mockSetIsEditAll).not.toHaveBeenCalled();
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("should return onSubmit function", () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    expect(typeof result.current.onSubmit).toBe("function");
  });
});
