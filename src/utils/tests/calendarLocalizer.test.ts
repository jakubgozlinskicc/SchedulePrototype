import { createLocalizer } from "../calendarLocalizer";
import { pl, enUS } from "date-fns/locale";
import { describe, it, expect } from "vitest";

describe("calendarLocalizer", () => {
  describe("createLocalizer", () => {
    it("It should create localizer for pl locale", () => {
      const localizer = createLocalizer(pl);

      expect(localizer).toBeDefined();
      expect(localizer.format).toBeDefined();
      expect(localizer.startOfWeek).toBeDefined();
    });

    it("It should create localizer for enUS locale", () => {
      const localizer = createLocalizer(enUS);

      expect(localizer).toBeDefined();
    });

    it("It should format date with pl locale", () => {
      const localizer = createLocalizer(pl);
      const date = new Date(2025, 11, 15);

      const formatted = localizer.format(date, "dd MMMM yyyy");

      expect(formatted).toBe("15 grudnia 2025");
    });

    it("It should format date with en locale", () => {
      const localizer = createLocalizer(enUS);
      const date = new Date(2025, 11, 15);

      const formatted = localizer.format(date, "dd MMMM yyyy");

      expect(formatted).toBe("15 December 2025");
    });
  });
});
