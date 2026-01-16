import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSubmitEvent } from "./useSubmitEvent";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../../../events/IEventRepository";
import type { EventFormData } from "../../../../../events/form/EventForm/eventFormSchema";

const mockReloadEvents = vi.fn();

vi.mock("../useReloadEvents/useReloadEvents", () => ({
  useReloadEvents: () => ({
    reloadEvents: mockReloadEvents,
  }),
}));

vi.mock(
  "../../../../../events/submitStrategies/submitStrategyRegistry",
  () => ({
    SubmitStrategyRegistry: {
      executeSubmit: vi.fn().mockResolvedValue(undefined),
    },
  })
);

import { SubmitStrategyRegistry } from "../../../../../events/submitStrategies/submitStrategyRegistry";

describe("useSubmitEvent", () => {
  let mockRepository: IEventRepository;
  let mockCloseModal: () => void;
  let mockFormData: EventFormData;
  let mockEvent: Event;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCloseModal = vi.fn();
    mockReloadEvents.mockResolvedValue(undefined);

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
      undefined
    );
  });

  it("should pass options to strategy registry when provided", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData, { isEditAll: true });
    });

    expect(SubmitStrategyRegistry.executeSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      mockRepository,
      { isEditAll: true }
    );
  });

  it("should pass isEditAll false when editing single occurrence", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData, { isEditAll: false });
    });

    expect(SubmitStrategyRegistry.executeSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      mockRepository,
      { isEditAll: false }
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

  it("should call closeModal after submitting event", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("should not close modal or reload events if an error occurs", async () => {
    (
      SubmitStrategyRegistry.executeSubmit as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("Submission failed"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockReloadEvents).not.toHaveBeenCalled();
    expect(mockCloseModal).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error saving event:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should return onSubmit function", () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository, mockEvent)
    );

    expect(typeof result.current.onSubmit).toBe("function");
  });

  it("should work without existing event (add mode)", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(SubmitStrategyRegistry.executeSubmit).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });
});
