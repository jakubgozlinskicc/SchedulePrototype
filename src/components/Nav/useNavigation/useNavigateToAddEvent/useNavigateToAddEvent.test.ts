import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNavigateToAddEvent } from "./useNavigateToAddEvent";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../../utils/getDefaultEvent/getDefaultEvent", () => ({
  getDefaultEvent: () => ({
    id: undefined,
    title: "",
    description: "",
    start: new Date("2024-01-01"),
    end: new Date("2024-01-01"),
    color: "#0000FF",
  }),
}));

describe("useNavigateToAddEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return handleAddEventClick function", () => {
    const { result } = renderHook(() => useNavigateToAddEvent());

    expect(result.current.handleAddEventClick).toBeDefined();
    expect(typeof result.current.handleAddEventClick).toBe("function");
  });

  it("should navigate to /event/add when handleAddEventClick is called", () => {
    const { result } = renderHook(() => useNavigateToAddEvent());

    act(() => {
      result.current.handleAddEventClick();
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/event/add");
  });
});
