import { describe, it, expect } from "vitest";
import { createEventFormSchema } from "./eventFormSchema";
import { addDays } from "date-fns";

const t = (key: string) => key;
const schema = createEventFormSchema(t);

const toDateTimeLocal = (date: Date) => {
  return date.toISOString().slice(0, 16);
};

describe("createEventFormSchema", () => {
  const validData = {
    title: "Test Event",
    description: "Description",
    start: toDateTimeLocal(new Date()),
    end: toDateTimeLocal(addDays(new Date(), 1)),
    color: "#0000FF",
    recurrenceType: "none",
    recurrenceInterval: 1,
    recurrenceEndType: "never",
    recurrenceEndDate: null,
    recurrenceCount: null,
  };

  describe("title validation", () => {
    it("should validate correct title", async () => {
      const result = await schema.validateAt("title", { title: "Valid Title" });
      expect(result).toBe("Valid Title");
    });

    it("should require title", async () => {
      await expect(schema.validateAt("title", { title: "" })).rejects.toThrow(
        "title-required"
      );
    });

    it("should require minimum 3 characters", async () => {
      await expect(schema.validateAt("title", { title: "AB" })).rejects.toThrow(
        "title-min-length"
      );
    });

    it("should accept title with 3 characters", async () => {
      const result = await schema.validateAt("title", { title: "ABC" });
      expect(result).toBe("ABC");
    });
  });

  describe("description validation", () => {
    it("should allow empty description", async () => {
      const result = await schema.validateAt("description", {
        description: "",
      });
      expect(result).toBe("");
    });

    it("should accept description", async () => {
      const result = await schema.validateAt("description", {
        description: "Some description",
      });
      expect(result).toBe("Some description");
    });
  });

  describe("start and end date validation", () => {
    it("should require start date", async () => {
      await expect(schema.validateAt("start", { start: "" })).rejects.toThrow(
        "start-required"
      );
    });

    it("should require end date", async () => {
      await expect(schema.validateAt("end", { end: "" })).rejects.toThrow(
        "end-required"
      );
    });

    it("should validate start is before end", async () => {
      const start = toDateTimeLocal(addDays(new Date(), 2));
      const end = toDateTimeLocal(new Date());

      await expect(
        schema.validate({ ...validData, start, end })
      ).rejects.toThrow("end-must-be-after-start");
    });

    it("should validate end is after start", async () => {
      const start = toDateTimeLocal(addDays(new Date(), 2));
      const end = toDateTimeLocal(new Date());

      await expect(
        schema.validate({ ...validData, start, end })
      ).rejects.toThrow();
    });

    it("should accept valid date range", async () => {
      const start = toDateTimeLocal(new Date());
      const end = toDateTimeLocal(addDays(new Date(), 1));

      const result = await schema.validate({ ...validData, start, end });
      expect(result.start).toBe(start);
      expect(result.end).toBe(end);
    });
  });

  describe("color validation", () => {
    it("should have default color", async () => {
      const result = await schema.validate({ ...validData, color: undefined });
      expect(result.color).toBe("#0000FF");
    });

    it("should accept valid color", async () => {
      const result = await schema.validate({ ...validData, color: "#FF0000" });
      expect(result.color).toBe("#FF0000");
    });
  });

  describe("recurrenceType validation", () => {
    it("should have default value none", async () => {
      const result = await schema.validate({
        ...validData,
        recurrenceType: undefined,
      });
      expect(result.recurrenceType).toBe("none");
    });

    it("should accept valid recurrence types", async () => {
      const types = ["none", "daily", "weekly", "monthly", "yearly"];

      for (const type of types) {
        const result = await schema.validate({
          ...validData,
          recurrenceType: type,
        });
        expect(result.recurrenceType).toBe(type);
      }
    });

    it("should reject invalid recurrence type", async () => {
      await expect(
        schema.validate({ ...validData, recurrenceType: "invalid" })
      ).rejects.toThrow();
    });
  });

  describe("recurrenceInterval validation", () => {
    it("should require interval when recurrence type is not none", async () => {
      await expect(
        schema.validate({
          ...validData,
          recurrenceType: "daily",
          recurrenceInterval: undefined,
        })
      ).rejects.toThrow("recurrence-interval-required");
    });

    it("should validate minimum interval", async () => {
      await expect(
        schema.validate({
          ...validData,
          recurrenceType: "daily",
          recurrenceInterval: 0,
        })
      ).rejects.toThrow("recurrence-interval-min");
    });

    it("should validate maximum interval", async () => {
      await expect(
        schema.validate({
          ...validData,
          recurrenceType: "daily",
          recurrenceInterval: 101,
        })
      ).rejects.toThrow("recurrence-interval-max");
    });

    it("should accept valid interval", async () => {
      const result = await schema.validate({
        ...validData,
        recurrenceType: "daily",
        recurrenceInterval: 5,
      });
      expect(result.recurrenceInterval).toBe(5);
    });

    it("should be optional when recurrence type is none", async () => {
      const result = await schema.validate({
        ...validData,
        recurrenceType: "none",
        recurrenceInterval: undefined,
      });
      expect(result.recurrenceInterval).toBe(1);
    });
  });

  describe("recurrenceEndType validation", () => {
    it("should have default value never", async () => {
      const result = await schema.validate({
        ...validData,
        recurrenceEndType: undefined,
      });
      expect(result.recurrenceEndType).toBe("never");
    });

    it("should accept valid end types", async () => {
      const types = ["never", "date", "count"];

      for (const type of types) {
        const result = await schema.validate({
          ...validData,
          recurrenceEndType: type,
          recurrenceType: "daily",
          recurrenceEndDate:
            type === "date" ? toDateTimeLocal(addDays(new Date(), 5)) : null,
          recurrenceCount: type === "count" ? 10 : null,
        });
        expect(result.recurrenceEndType).toBe(type);
      }
    });
  });

  describe("recurrenceEndDate validation", () => {
    it("should require end date when end type is date and type is not none", async () => {
      await expect(
        schema.validate({
          ...validData,
          recurrenceType: "daily",
          recurrenceEndType: "date",
          recurrenceEndDate: null,
        })
      ).rejects.toThrow("recurrence-end-date-required");
    });

    it("should validate end date is after start", async () => {
      const start = toDateTimeLocal(new Date());
      const endDate = toDateTimeLocal(new Date());

      await expect(
        schema.validate({
          ...validData,
          start,
          recurrenceType: "daily",
          recurrenceEndType: "date",
          recurrenceEndDate: endDate,
        })
      ).rejects.toThrow("recurrence-end-date-must-be-after-start");
    });

    it("should accept valid end date", async () => {
      const start = toDateTimeLocal(new Date());
      const endDate = toDateTimeLocal(addDays(new Date(), 5));

      const result = await schema.validate({
        ...validData,
        start,
        recurrenceType: "daily",
        recurrenceEndType: "date",
        recurrenceEndDate: endDate,
      });

      expect(result.recurrenceEndDate).toBe(endDate);
    });

    it("should be optional when end type is never", async () => {
      const result = await schema.validate({
        ...validData,
        recurrenceType: "daily",
        recurrenceEndType: "never",
        recurrenceEndDate: null,
      });

      expect(result.recurrenceEndDate).toBeNull();
    });
  });

  describe("recurrenceCount validation", () => {
    it("should require count when end type is count and type is not none", async () => {
      await expect(
        schema.validate({
          ...validData,
          recurrenceType: "daily",
          recurrenceEndType: "count",
          recurrenceCount: null,
        })
      ).rejects.toThrow("recurrence-count-required");
    });

    it("should validate minimum count", async () => {
      await expect(
        schema.validate({
          ...validData,
          recurrenceType: "daily",
          recurrenceEndType: "count",
          recurrenceCount: 1,
        })
      ).rejects.toThrow("recurrence-count-min");
    });

    it("should validate maximum count", async () => {
      await expect(
        schema.validate({
          ...validData,
          recurrenceType: "daily",
          recurrenceEndType: "count",
          recurrenceCount: 400,
        })
      ).rejects.toThrow("recurrence-count-max");
    });

    it("should accept valid count", async () => {
      const result = await schema.validate({
        ...validData,
        recurrenceType: "daily",
        recurrenceEndType: "count",
        recurrenceCount: 10,
      });

      expect(result.recurrenceCount).toBe(10);
    });

    it("should be optional when end type is never", async () => {
      const result = await schema.validate({
        ...validData,
        recurrenceType: "daily",
        recurrenceEndType: "never",
        recurrenceCount: null,
      });

      expect(result.recurrenceCount).toBeNull();
    });
  });
});
