import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLoadEvents } from "./useLoadEvents";
import type { IEventRepository } from "../IEventRepository";

const mockReloadEvents = vi.fn();

vi.mock("./useReloadEvents", () => ({
  useReloadEvents: () => ({
    reloadEvents: mockReloadEvents,
  }),
}));

describe("useLoadEvents", () => {
  let mockRepository: IEventRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReloadEvents.mockResolvedValue(undefined);

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("It should load events on mount", async () => {
    renderHook(() => useLoadEvents(mockRepository));

    await waitFor(() => {
      expect(mockReloadEvents).toHaveBeenCalledTimes(1);
    });
  });
});
