import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventFormSubmit } from "./useEventFormSubmit";
import type { Event } from "../../../../../db/scheduleDb";
import type { EventFormData } from "../../eventFormSchema";
import type { IEventRepository } from "../../../../IEventRepository";

const mockReloadEvents = vi.fn();
const mockGoToOverview = vi.fn();

vi.mock(
  "../../../../../pages/OverviewPage/components/EventList/useEventList/useReloadEvents/useReloadEvents",
  () => ({
    useReloadEvents: () => ({
      reloadEvents: mockReloadEvents,
    }),
  })
);

vi.mock("../useEventFormNavigation/useEventFormNavigation", () => ({
  useEventFormNavigation: () => ({
    goToOverview: mockGoToOverview,
  }),
}));

vi.mock("../../../../submitStrategies/SubmitStrategyRegistry", () => ({
  SubmitStrategyRegistry: {
    executeSubmit: vi.fn().mockResolvedValue(undefined),
  },
}));

import { SubmitStrategyRegistry } from "../../../../submitStrategies/SubmitStrategyRegistry";

describe("useEventFormSubmit", () => {
  let mockRepository: IEventRepository;
  let mockFormData: EventFormData;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReloadEvents.mockResolvedValue(undefined);

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(undefined),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };

    mockFormData = {
      title: "Test Event",
      description: "Test Description",
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

  it("should return onSubmit function", () => {
    const { result } = renderHook(() => useEventFormSubmit(mockRepository));

    expect(typeof result.current.onSubmit).toBe("function");
  });

  it("should call SubmitStrategyRegistry.executeSubmit on submit", async () => {
    const { result } = renderHook(() => useEventFormSubmit(mockRepository));

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(SubmitStrategyRegistry.executeSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Event",
        description: "Test Description",
      }),
      mockRepository,
      { isEditAll: false }
    );
  });

  it("should pass isEditAll true when specified", async () => {
    const { result } = renderHook(() => useEventFormSubmit(mockRepository));

    await act(async () => {
      await result.current.onSubmit(mockFormData, true);
    });

    expect(SubmitStrategyRegistry.executeSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      mockRepository,
      { isEditAll: true }
    );
  });

  it("should call reloadEvents after successful submit", async () => {
    const { result } = renderHook(() => useEventFormSubmit(mockRepository));

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockReloadEvents).toHaveBeenCalledTimes(1);
  });

  it("should call goToOverview after successful submit", async () => {
    const { result } = renderHook(() => useEventFormSubmit(mockRepository));

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockGoToOverview).toHaveBeenCalledTimes(1);
  });

  it("should include existing event data when event is provided", async () => {
    const existingEvent: Event = {
      id: 1,
      title: "Existing",
      description: "Existing desc",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#FF0000",
    };

    const { result } = renderHook(() =>
      useEventFormSubmit(mockRepository, existingEvent)
    );

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(SubmitStrategyRegistry.executeSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        title: "Test Event",
      }),
      mockRepository,
      { isEditAll: false }
    );
  });

  it("should not call reloadEvents or goToOverview on error", async () => {
    vi.mocked(SubmitStrategyRegistry.executeSubmit).mockRejectedValueOnce(
      new Error("Submit failed")
    );

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useEventFormSubmit(mockRepository));

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockReloadEvents).not.toHaveBeenCalled();
    expect(mockGoToOverview).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should log error on failure", async () => {
    const error = new Error("Submit failed");
    vi.mocked(SubmitStrategyRegistry.executeSubmit).mockRejectedValueOnce(
      error
    );

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useEventFormSubmit(mockRepository));

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error saving event:", error);

    consoleSpy.mockRestore();
  });
});
