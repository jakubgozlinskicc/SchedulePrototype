import { describe, it, expect } from "vitest";
import { createFormats } from "./dateFormats";
import { pl, enUS } from "date-fns/locale";
import type { Culture } from "react-big-calendar";

describe("dateFormats", () => {
  const defaultCulture: Culture = "";

  describe("createFormats", () => {
    describe("with pl locale", () => {
      const formats = createFormats(pl);

      it("should format day range", () => {
        const start = new Date(2025, 11, 1);
        const end = new Date(2025, 11, 7);

        const formatter = formats.dayRangeHeaderFormat;
        if (typeof formatter !== "function") {
          throw new Error("dayRangeHeaderFormat should be a function");
        }

        const result = formatter({ start, end }, defaultCulture);

        expect(result).toBe("01 grudzień 2025 - 07 grudzień 2025  ");
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

        expect(result).toBe("10 grudnia 2025 środa");
      });
    });

    describe("with english locale", () => {
      const formats = createFormats(enUS);

      it("should format day range", () => {
        const start = new Date(2025, 11, 10);
        const end = new Date(2025, 11, 15);

        const formatter = formats.dayRangeHeaderFormat;
        if (typeof formatter !== "function") {
          throw new Error("dayRangeHeaderFormat should be a function");
        }

        const result = formatter({ start, end }, defaultCulture);

        expect(result).toBe("10 December 2025 - 15 December 2025  ");
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

        expect(result).toBe("10 December 2025 Wednesday");
      });
    });
  });
});
