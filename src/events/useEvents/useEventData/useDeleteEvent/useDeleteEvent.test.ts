import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Event } from "../../../../db/scheduleDb";
import { renderHook, act } from "@testing-library/react";
import { useDeleteEvent } from "./useDeleteEvent";
import { DeleteStrategyRegistry } from "./deleteStrategies/deleteStrategyRegistry";
import type { IEventRepository } from "../../IEventRepository";

let mockEventData: Event;
let mockIsDeleteAll: boolean;
const mockReloadEvents = vi.fn();
const mockSetIsDeleteAll = vi.fn();

vi.mock("../../useEventDataContext/useEventDataContext", () => ({
  useEventDataContext: () => ({
    eventData: mockEventData,
    isDeleteAll: mockIsDeleteAll,
    setIsDeleteAll: mockSetIsDeleteAll,
  }),
}));

vi.mock("../useReloadEvents/useReloadEvents", () => ({
  useReloadEvents: () => ({
    reloadEvents: mockReloadEvents,
  }),
}));

vi.mock("./deleteStrategies/deleteStrategyRegistry", () => ({
  DeleteStrategyRegistry: {
    executeDelete: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("useDeleteEvent", () => {
  let mockRepository: IEventRepository;
  let mockCloseModal: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCloseModal = vi.fn();
    mockReloadEvents.mockResolvedValue(undefined);
    mockIsDeleteAll = false;

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

  it("should call DeleteStrategyRegistry.executeDelete with correct parameters", async () => {
    const { result } = renderHook(() =>
      useDeleteEvent(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(DeleteStrategyRegistry.executeDelete).toHaveBeenCalledWith(
      mockEventData,
      mockRepository,
      { isDeleteAll: false }
    );
  });

  it("should pass isDeleteAll option to strategy registry", async () => {
    mockIsDeleteAll = true;

    const { result } = renderHook(() =>
      useDeleteEvent(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });
    expect(DeleteStrategyRegistry.executeDelete).toHaveBeenCalledWith(
      mockEventData,
      mockRepository,
      { isDeleteAll: true }
    );
  });

  it("should call reloadEvents after deletion", async () => {
    const { result } = renderHook(() =>
      useDeleteEvent(mockCloseModal, mockRepository)
    );
    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockReloadEvents).toHaveBeenCalled();
  });

  it("should call closeModal after deletion", async () => {
    const { result } = renderHook(() =>
      useDeleteEvent(mockCloseModal, mockRepository)
    );
    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should reset isDeleteAll to false after deletion", async () => {
    mockIsDeleteAll = true;
    const { result } = renderHook(() =>
      useDeleteEvent(mockCloseModal, mockRepository)
    );
    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockSetIsDeleteAll).toHaveBeenCalledWith(false);
  });

  it("should not close modal when strategy throws error", async () => {
    (
      DeleteStrategyRegistry.executeDelete as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error("Delete failed"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useDeleteEvent(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockCloseModal).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error during deleting event:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
  it("should not reload events when strategy throws error", async () => {
    (
      DeleteStrategyRegistry.executeDelete as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error("Delete failed"));

    vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useDeleteEvent(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockReloadEvents).not.toHaveBeenCalled();
  });
});
