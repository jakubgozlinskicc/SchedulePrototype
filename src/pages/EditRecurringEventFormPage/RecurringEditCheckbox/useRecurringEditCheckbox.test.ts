import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecurringEditCheckBox } from "./useRecurringEditCheckbox";

describe("useRecurringEditCheckbox", () => {
  it("should initialize with isEditAll as false", () => {
    const { result } = renderHook(() => useRecurringEditCheckBox());
    expect(result.current.isEditAll).toBe(false);
  });

  it("should update isEditAll when handleChange is called with checked", () => {
    const { result } = renderHook(() => useRecurringEditCheckBox());

    act(() => {
      result.current.handleChange({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.isEditAll).toBe(true);
  });

  it("should update isEditAll when handleChange is called with unchecked", () => {
    const { result } = renderHook(() => useRecurringEditCheckBox());

    act(() => {
      result.current.handleChange({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.isEditAll).toBe(true);

    act(() => {
      result.current.handleChange({
        target: { checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.isEditAll).toBe(false);
  });

  it("should toggle isEditAll multiple times", () => {
    const { result } = renderHook(() => useRecurringEditCheckBox());

    expect(result.current.isEditAll).toBe(false);

    act(() => {
      result.current.handleChange({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.isEditAll).toBe(true);

    act(() => {
      result.current.handleChange({
        target: { checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.isEditAll).toBe(false);

    act(() => {
      result.current.handleChange({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.isEditAll).toBe(true);
  });
});
