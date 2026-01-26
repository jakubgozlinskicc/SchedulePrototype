import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useEventFormSchema } from "./useEventFormSchema";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("useEventFormSchema", () => {
  it("should return eventFormSchema object", () => {
    const { result } = renderHook(() => useEventFormSchema());

    expect(result.current).toHaveProperty("eventFormSchema");
  });

  it("should return a yup schema", () => {
    const { result } = renderHook(() => useEventFormSchema());

    expect(result.current.eventFormSchema).toBeDefined();
    expect(typeof result.current.eventFormSchema.validate).toBe("function");
  });

  it("should have required fields in schema", () => {
    const { result } = renderHook(() => useEventFormSchema());
    const schema = result.current.eventFormSchema;

    expect(schema.fields).toHaveProperty("title");
    expect(schema.fields).toHaveProperty("description");
    expect(schema.fields).toHaveProperty("start");
    expect(schema.fields).toHaveProperty("end");
    expect(schema.fields).toHaveProperty("color");
    expect(schema.fields).toHaveProperty("recurrenceType");
  });
});
