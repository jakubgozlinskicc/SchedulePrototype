import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCalendarLocale } from "./useCalendarLocale";

let mockCurrentLanguage: "pl" | "enUS";

vi.mock("../../../../../locales/useTranslationContext", () => ({
  useTranslationContext: () => ({
    currentLanguage: mockCurrentLanguage,
  }),
}));

vi.mock("../../../../../utils/calendarLocalizer/calendarLocalizer", () => ({
  locales: {
    pl: { code: "pl" },
    enUS: { code: "en-US" },
  },
  createLocalizer: vi.fn().mockReturnValue({ startOfWeek: vi.fn() }),
}));

vi.mock("../../../../../utils/dateFormats/dateFormats", () => ({
  createFormats: vi.fn().mockReturnValue({ dayFormat: "dd" }),
}));

import {
  createLocalizer,
  locales,
} from "../../../../../utils/calendarLocalizer/calendarLocalizer";
import { createFormats } from "../../../../../utils/dateFormats/dateFormats";

describe("useCalendarLocale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentLanguage = "enUS";
  });

  it("should return localizer and formats", () => {
    const { result } = renderHook(() => useCalendarLocale());

    expect(result.current.localizer).toBeDefined();
    expect(result.current.formats).toBeDefined();
  });

  it("should use English locale when language is enUS", () => {
    mockCurrentLanguage = "enUS";

    renderHook(() => useCalendarLocale());

    expect(createLocalizer).toHaveBeenCalledWith(locales.enUS);
    expect(createFormats).toHaveBeenCalledWith(locales.enUS);
  });

  it("should use Polish locale when language is pl", () => {
    mockCurrentLanguage = "pl";

    renderHook(() => useCalendarLocale());

    expect(createLocalizer).toHaveBeenCalledWith(locales.pl);
    expect(createFormats).toHaveBeenCalledWith(locales.pl);
  });

  it("should return localizer from createLocalizer", () => {
    const { result } = renderHook(() => useCalendarLocale());

    expect(result.current.localizer).toEqual({
      startOfWeek: expect.any(Function),
    });
  });

  it("should return formats from createFormats", () => {
    const { result } = renderHook(() => useCalendarLocale());

    expect(result.current.formats).toEqual({ dayFormat: "dd" });
  });

  it("should call createLocalizer once per render", () => {
    renderHook(() => useCalendarLocale());

    expect(createLocalizer).toHaveBeenCalledTimes(1);
  });

  it("should call createFormats once per render", () => {
    renderHook(() => useCalendarLocale());

    expect(createFormats).toHaveBeenCalledTimes(1);
  });
});
