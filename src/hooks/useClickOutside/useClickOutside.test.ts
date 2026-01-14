import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useClickOutside } from "./useClickOutside";
import { createRef } from "react";

describe("useClickOutside", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should call onClickOutside when clicking outside the element", () => {
    const onClickOutside = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const innerDiv = document.createElement("div");
    container.appendChild(innerDiv);
    (ref as { current: HTMLDivElement }).current = innerDiv;

    renderHook(() => useClickOutside(ref, onClickOutside));

    const event = new MouseEvent("mousedown", { bubbles: true });
    document.body.dispatchEvent(event);

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it("should not call onClickOutside when clicking inside the element", () => {
    const onClickOutside = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const innerDiv = document.createElement("div");
    container.appendChild(innerDiv);
    (ref as { current: HTMLDivElement }).current = innerDiv;

    renderHook(() => useClickOutside(ref, onClickOutside));

    const event = new MouseEvent("mousedown", { bubbles: true });
    innerDiv.dispatchEvent(event);

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it("should cleanup event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
    const onClickOutside = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const innerDiv = document.createElement("div");
    container.appendChild(innerDiv);
    (ref as { current: HTMLDivElement }).current = innerDiv;

    const { unmount } = renderHook(() => useClickOutside(ref, onClickOutside));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it("should not throw when ref.current is null", () => {
    const onClickOutside = vi.fn();
    const ref = createRef<HTMLDivElement>();

    renderHook(() => useClickOutside(ref, onClickOutside));

    const event = new MouseEvent("mousedown", { bubbles: true });

    expect(() => document.body.dispatchEvent(event)).not.toThrow();
    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
