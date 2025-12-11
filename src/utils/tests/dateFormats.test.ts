import { describe, it, expect } from "vitest";
import { createFormats } from "../dateFormats";
import { pl, enUS } from "date-fns/locale";
import type { Culture } from "react-big-calendar";

describe("dateFormats", () => {
  const defaultCulture: Culture = "";

  describe("createFormats", () => {
    describe("with pl locale", () => {
      const formats = createFormats(pl);
      it("should format day range", () => {
        const start = new Date(2025, 11, 10);
        const end = new Date(2025, 11, 15);

        const formatter = formats.dayRangeHeaderFormat;
        if (typeof formatter !== "function") {
          throw new Error("dayRangeHeaderFormat should be a function");
        }

        const result = formatter({ start, end }, defaultCulture);

        expect(result).toBe("10-15 grudzień");
      });

      it("should handle range in one day", () => {
        const start = new Date(2025, 11, 11);
        const end = new Date(2024, 11, 11);

        const formatter = formats.dayRangeHeaderFormat;
        if (typeof formatter !== "function") {
          throw new Error("dayRangeHeaderFormat should be a function");
        }

        const result = formatter({ start, end }, defaultCulture);

        expect(result).toBe("11-11 grudzień");
      });

      it("should format month header", () => {
        const date = new Date(2025, 11, 10);

        const formatter = formats.monthHeaderFormat;
        if (typeof formatter !== "function") {
          throw new Error("monthHeaderFormat should be a function");
        }

        const result = formatter(date, defaultCulture);

        expect(result).toBe("grudzień 2025");
      });

      it("should format day header", () => {
        const date = new Date(2025, 11, 10);

        const formatter = formats.dayHeaderFormat;
        if (typeof formatter !== "function") {
          throw new Error("dayHeaderFormat should be a function");
        }

        const result = formatter(date, defaultCulture);

        expect(result).toBe("10 grudnia środa");
      });
    });

    describe("z angielskim locale", () => {
      const formats = createFormats(enUS);

      it("should format day range", () => {
        const start = new Date(2025, 11, 10);
        const end = new Date(2025, 11, 15);

        const formatter = formats.dayRangeHeaderFormat;
        if (typeof formatter !== "function") {
          throw new Error("dayRangeHeaderFormat should be a function");
        }

        const result = formatter({ start, end }, defaultCulture);

        expect(result).toBe("10-15 December");
      });

      it("should format month header", () => {
        const date = new Date(2025, 11, 10);

        const formatter = formats.monthHeaderFormat;
        if (typeof formatter !== "function") {
          throw new Error("monthHeaderFormat should be a function");
        }

        const result = formatter(date, defaultCulture);

        expect(result).toBe("December 2025");
      });

      it("should format day header", () => {
        const date = new Date(2025, 11, 10);

        const formatter = formats.dayHeaderFormat;
        if (typeof formatter !== "function") {
          throw new Error("dayHeaderFormat should be a function");
        }

        const result = formatter(date, defaultCulture);

        expect(result).toBe("10 December Wednesday");
      });
    });
  });
});
