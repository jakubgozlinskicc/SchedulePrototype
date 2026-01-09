import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNavigateToAddEvent } from "./useNavigateToAddEvent";

const mockNavigate = vi.fn();
const mockSetEventData = vi.fn();
const mockSetIsEditAll = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock(
  "../../../../events/useEvents/useEventDataContext/useEventDataContext",
  () => ({
    useEventDataContext: () => ({
      setEventData: mockSetEventData,
      setIsEditAll: mockSetIsEditAll,
    }),
  })
);

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

  it("should call setEventData with default event when handleAddEventClick is called", () => {
    const { result } = renderHook(() => useNavigateToAddEvent());

    act(() => {
      result.current.handleAddEventClick();
    });

    expect(mockSetEventData).toHaveBeenCalledTimes(1);
    expect(mockSetEventData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: undefined,
        title: "",
        description: "",
        color: "#0000FF",
      })
    );
  });

  it("should call setIsEditAll with false when handleAddEventClick is called", () => {
    const { result } = renderHook(() => useNavigateToAddEvent());

    act(() => {
      result.current.handleAddEventClick();
    });

    expect(mockSetIsEditAll).toHaveBeenCalledTimes(1);
    expect(mockSetIsEditAll).toHaveBeenCalledWith(false);
  });

  it("should navigate to /event/add when handleAddEventClick is called", () => {
    const { result } = renderHook(() => useNavigateToAddEvent());

    act(() => {
      result.current.handleAddEventClick();
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/event/add");
  });

  it("should call functions in correct order", () => {
    const callOrder: string[] = [];

    mockSetEventData.mockImplementation(() => callOrder.push("setEventData"));
    mockSetIsEditAll.mockImplementation(() => callOrder.push("setIsEditAll"));
    mockNavigate.mockImplementation(() => callOrder.push("navigate"));

    const { result } = renderHook(() => useNavigateToAddEvent());

    act(() => {
      result.current.handleAddEventClick();
    });

    expect(callOrder).toEqual(["setEventData", "setIsEditAll", "navigate"]);
  });

  it("should reset state before navigation", () => {
    const { result } = renderHook(() => useNavigateToAddEvent());

    act(() => {
      result.current.handleAddEventClick();
    });

    expect(mockSetEventData).toHaveBeenCalled();
    expect(mockSetIsEditAll).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });
});
