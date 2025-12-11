import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventModal } from "../useEventModal";

describe("useEventModal", () => {
  it("It should open modal when openModal is called", () => {
    const { result } = renderHook(() => useEventModal());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isModalOpen).toBe(true);
  });

  it("It should close modal when closeModal is called", () => {
    const { result } = renderHook(() => useEventModal());

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isModalOpen).toBe(false);
  });
});
