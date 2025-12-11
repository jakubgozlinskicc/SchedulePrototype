import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSubmitEvent } from "./useSubmitEvent";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../IEventRepository";

let mockEventData: Event;
const mockReloadEvents = vi.fn();

vi.mock("../../useContext/useEventDataContext.ts", () => ({
  useEventDataContext: () => ({
    eventData: mockEventData,
  }),
}));

vi.mock("../useReloadEvents/useReloadEvents", () => ({
  useReloadEvents: () => ({
    reloadEvents: mockReloadEvents,
  }),
}));

describe("useSubmitEvent", () => {
  let mockRepository: IEventRepository;
  let mockCloseModal: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCloseModal = vi.fn();
    mockReloadEvents.mockResolvedValue(undefined);

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
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

  it("It should submit form and edit event when id exists", async () => {
    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository)
    );

    const fakeEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockRepository.editEvent).toHaveBeenCalledWith(
      mockEventData.id as number,
      mockEventData
    );
    expect(mockRepository.addEvent).not.toHaveBeenCalled();
    expect(mockReloadEvents).toHaveBeenCalledTimes(1);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("It should submit form and add event when id is missing", async () => {
    mockEventData = {
      title: "New event",
      description: "New",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#FF0000",
    };

    const { result } = renderHook(() =>
      useSubmitEvent(mockCloseModal, mockRepository)
    );

    const fakeEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockRepository.addEvent).toHaveBeenCalledWith(mockEventData);
    expect(mockRepository.editEvent).not.toHaveBeenCalled();
    expect(mockReloadEvents).toHaveBeenCalledTimes(1);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
