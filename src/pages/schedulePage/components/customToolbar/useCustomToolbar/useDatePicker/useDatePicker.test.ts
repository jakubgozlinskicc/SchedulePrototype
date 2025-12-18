import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDatePicker } from "./useDatePicker";
import { DatePickerStrategyRegistry } from "../../strategies/datePickerRegistry";

vi.mock("../../strategies/datePickerRegistry", () => ({
  DatePickerStrategyRegistry: {
    provideConfig: vi.fn(),
  },
}));

const MockDatePickerComponent = vi.fn(() => null);

describe("useDatePicker", () => {
  const mockOnNavigate = vi.fn();
  const defaultProps = {
    onNavigate: mockOnNavigate,
    view: "month",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (
      DatePickerStrategyRegistry.provideConfig as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      getComponent: () => MockDatePickerComponent,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return isDatePickerOpen as false initially", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    expect(result.current.isDatePickerOpen).toBe(false);
  });

  it("should return date picker ref", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    expect(result.current.datePickerRef).toBeDefined();
    expect(result.current.datePickerRef.current).toBeNull();
  });

  it("should return DatePicker component from strategy registry", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    expect(DatePickerStrategyRegistry.provideConfig).toHaveBeenCalledWith(
      "month"
    );
    expect(result.current.DatePickerComponent).toBe(MockDatePickerComponent);
  });

  it("should return all required functions", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    expect(typeof result.current.handleDateChange).toBe("function");
    expect(typeof result.current.toggleDatePicker).toBe("function");
    expect(typeof result.current.closeDatePicker).toBe("function");
  });

  it("should open date picker when it is closed", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    act(() => {
      result.current.toggleDatePicker();
    });

    expect(result.current.isDatePickerOpen).toBe(true);
  });

  it("should close date picker when it is open", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    act(() => {
      result.current.toggleDatePicker();
    });
    act(() => {
      result.current.toggleDatePicker();
    });

    expect(result.current.isDatePickerOpen).toBe(false);
  });

  it("should toggle state multiple times", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    act(() => result.current.toggleDatePicker());
    expect(result.current.isDatePickerOpen).toBe(true);

    act(() => result.current.toggleDatePicker());
    expect(result.current.isDatePickerOpen).toBe(false);

    act(() => result.current.toggleDatePicker());
    expect(result.current.isDatePickerOpen).toBe(true);
  });

  it("should keep date picker closed when already closed", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    expect(result.current.isDatePickerOpen).toBe(false);

    act(() => {
      result.current.closeDatePicker();
    });

    expect(result.current.isDatePickerOpen).toBe(false);
  });

  it("should call onNavigate with DATE action and new date", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));
    const testDate = new Date(2024, 5, 15);

    act(() => {
      result.current.handleDateChange(testDate);
    });

    expect(mockOnNavigate).toHaveBeenCalledWith("DATE", testDate);
    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
  });

  it("should close date picker after selecting a date", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    act(() => {
      result.current.toggleDatePicker();
    });
    expect(result.current.isDatePickerOpen).toBe(true);

    act(() => {
      result.current.handleDateChange(new Date());
    });

    expect(result.current.isDatePickerOpen).toBe(false);
  });

  it("should not call onNavigate when date is null", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    act(() => {
      result.current.handleDateChange(null);
    });

    expect(mockOnNavigate).not.toHaveBeenCalled();
  });

  it("should not close date picker when date is null", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    act(() => {
      result.current.toggleDatePicker();
    });

    act(() => {
      result.current.handleDateChange(null);
    });

    expect(result.current.isDatePickerOpen).toBe(true);
  });

  it("should close date picker when clicking outside element", async () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    const divElement = document.createElement("div");
    document.body.appendChild(divElement);

    Object.defineProperty(result.current.datePickerRef, "current", {
      value: divElement,
      writable: true,
    });

    act(() => {
      result.current.toggleDatePicker();
    });
    expect(result.current.isDatePickerOpen).toBe(true);

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    await act(async () => {
      const mouseEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, "target", { value: outsideElement });
      document.dispatchEvent(mouseEvent);
    });

    expect(result.current.isDatePickerOpen).toBe(false);

    document.body.removeChild(divElement);
    document.body.removeChild(outsideElement);
  });

  it("should not close date picker when clicking inside element", () => {
    const { result } = renderHook(() => useDatePicker(defaultProps));

    const divElement = document.createElement("div");
    document.body.appendChild(divElement);

    Object.defineProperty(result.current.datePickerRef, "current", {
      value: divElement,
      writable: true,
    });

    act(() => {
      result.current.toggleDatePicker();
    });

    act(() => {
      const mouseEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, "target", { value: divElement });
      document.dispatchEvent(mouseEvent);
    });

    expect(result.current.isDatePickerOpen).toBe(true);

    document.body.removeChild(divElement);
  });

  it("should not add event listener when date picker is closed", () => {
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");

    renderHook(() => useDatePicker(defaultProps));

    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
  });

  it("should remove event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { result, unmount } = renderHook(() => useDatePicker(defaultProps));

    act(() => {
      result.current.toggleDatePicker();
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
  });

  it("should fetch new strategy when view changes", () => {
    const { rerender } = renderHook(
      ({ view }) => useDatePicker({ onNavigate: mockOnNavigate, view }),
      { initialProps: { view: "month" } }
    );

    expect(DatePickerStrategyRegistry.provideConfig).toHaveBeenCalledWith(
      "month"
    );

    rerender({ view: "week" });

    expect(DatePickerStrategyRegistry.provideConfig).toHaveBeenCalledWith(
      "week"
    );
  });

  it("should return appropriate component for each view", () => {
    const WeekPickerComponent = vi.fn(() => null);
    const MonthPickerComponent = vi.fn(() => null);

    (
      DatePickerStrategyRegistry.provideConfig as ReturnType<typeof vi.fn>
    ).mockImplementation((view: string) => ({
      getComponent: () =>
        view === "week" ? WeekPickerComponent : MonthPickerComponent,
    }));

    const { result, rerender } = renderHook(
      ({ view }) => useDatePicker({ onNavigate: mockOnNavigate, view }),
      { initialProps: { view: "month" } }
    );

    expect(result.current.DatePickerComponent).toBe(MonthPickerComponent);

    rerender({ view: "week" });

    expect(result.current.DatePickerComponent).toBe(WeekPickerComponent);
  });
});
