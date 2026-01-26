import { describe, it, expect } from "vitest";
import { convertFormDataToEvent } from "./convertFormDataToEvent";
import type { EventFormData } from "../eventFormSchema";
import type { Event } from "../../../../db/scheduleDb";

describe("convertFormDataToEvent", () => {
  const baseFormData: EventFormData = {
    title: "Test Event",
    description: "Test Description",
    start: "2025-12-10T10:00",
    end: "2025-12-10T11:00",
    color: "#0000FF",
    recurrenceType: "none",
    recurrenceInterval: 1,
    recurrenceEndType: "never",
    recurrenceEndDate: undefined,
    recurrenceCount: undefined,
  };

  describe("basic conversion", () => {
    it("should convert form data to event", () => {
      const result = convertFormDataToEvent(baseFormData);

      expect(result.title).toBe("Test Event");
      expect(result.description).toBe("Test Description");
      expect(result.color).toBe("#0000FF");
    });

    it("should convert start string to Date", () => {
      const result = convertFormDataToEvent(baseFormData);

      expect(result.start).toBeInstanceOf(Date);
      expect(result.start.toISOString()).toContain("2025-12-10");
    });

    it("should convert end string to Date", () => {
      const result = convertFormDataToEvent(baseFormData);

      expect(result.end).toBeInstanceOf(Date);
      expect(result.end.toISOString()).toContain("2025-12-10");
    });
  });

  describe("with existing event data", () => {
    it("should preserve existing event id", () => {
      const existingEvent: Event = {
        id: 42,
        title: "Old Title",
        description: "Old Description",
        start: new Date(),
        end: new Date(),
        color: "#FF0000",
      };

      const result = convertFormDataToEvent(baseFormData, existingEvent);

      expect(result.id).toBe(42);
    });

    it("should preserve recurringEventId", () => {
      const existingEvent: Event = {
        title: "Old Title",
        description: "Old Description",
        start: new Date(),
        end: new Date(),
        color: "#FF0000",
        recurringEventId: 5,
      };

      const result = convertFormDataToEvent(baseFormData, existingEvent);

      expect(result.recurringEventId).toBe(5);
    });

    it("should override title from form data", () => {
      const existingEvent: Event = {
        id: 1,
        title: "Old Title",
        description: "Old",
        start: new Date(),
        end: new Date(),
        color: "#FF0000",
      };

      const result = convertFormDataToEvent(baseFormData, existingEvent);

      expect(result.title).toBe("Test Event");
    });
  });

  describe("recurrence rule building", () => {
    it("should create recurrence rule with type none", () => {
      const result = convertFormDataToEvent(baseFormData);

      expect(result.recurrenceRule).toEqual({
        type: "none",
        interval: 1,
      });
    });

    it("should create daily recurrence rule", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "daily",
        recurrenceInterval: 2,
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule).toEqual({
        type: "daily",
        interval: 2,
      });
    });

    it("should create weekly recurrence rule", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "weekly",
        recurrenceInterval: 1,
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule?.type).toBe("weekly");
    });

    it("should create monthly recurrence rule", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "monthly",
        recurrenceInterval: 3,
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule?.type).toBe("monthly");
      expect(result.recurrenceRule?.interval).toBe(3);
    });

    it("should create yearly recurrence rule", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "yearly",
        recurrenceInterval: 1,
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule?.type).toBe("yearly");
    });

    it("should use default interval 1 when not specified", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "daily",
        recurrenceInterval: undefined as unknown as number,
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule?.interval).toBe(1);
    });
  });

  describe("recurrence end type", () => {
    it("should add endDate when recurrenceEndType is date", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "daily",
        recurrenceEndType: "date",
        recurrenceEndDate: "2025-12-31T23:59",
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule?.endDate).toBeInstanceOf(Date);
      expect(result.recurrenceRule?.endDate?.toISOString()).toContain(
        "2025-12-31"
      );
    });

    it("should not add endDate when recurrenceEndType is never", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "daily",
        recurrenceEndType: "never",
        recurrenceEndDate: "2025-12-31T23:59",
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule?.endDate).toBeUndefined();
    });

    it("should add count when recurrenceEndType is count", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "daily",
        recurrenceEndType: "count",
        recurrenceCount: 10,
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule?.count).toBe(10);
    });

    it("should not add count when recurrenceEndType is never", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "daily",
        recurrenceEndType: "never",
        recurrenceCount: 10,
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule?.count).toBeUndefined();
    });

    it("should not add count when recurrenceEndType is date", () => {
      const formData: EventFormData = {
        ...baseFormData,
        recurrenceType: "daily",
        recurrenceEndType: "date",
        recurrenceEndDate: "2025-12-31T23:59",
        recurrenceCount: 10,
      };

      const result = convertFormDataToEvent(formData);

      expect(result.recurrenceRule?.count).toBeUndefined();
    });
  });
});
