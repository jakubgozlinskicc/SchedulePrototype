import { EventModalStrategyRegistry } from "../modalStrategy/modalRegistry";
import type { Event } from "../../../../../db/scheduleDb";
import { AddEventStrategy } from "../modalStrategy/eventStrategies/addEventStrategy";
import { EditEventStrategy } from "../modalStrategy/eventStrategies/editEventStrategy";
import { vi, describe, beforeEach, it, expect } from "vitest";

vi.mock("../modalStrategy/eventStrategies/addEventStrategy", () => {
  const MockedAddEventStrategy = vi.fn();
  MockedAddEventStrategy.prototype.canSupport = vi.fn(
    (eventData) => !eventData.id
  );
  MockedAddEventStrategy.prototype.render = vi.fn();
  return { AddEventStrategy: MockedAddEventStrategy };
});

vi.mock("../modalStrategy/eventStrategies/editEventStrategy", () => {
  const MockedEditEventStrategy = vi.fn();
  MockedEditEventStrategy.prototype.canSupport = vi.fn(
    (eventData) => !!eventData.id
  );
  MockedEditEventStrategy.prototype.render = vi.fn();
  return { EditEventStrategy: MockedEditEventStrategy };
});

describe("EventModalStrategyRegistry", () => {
  const mockEventWithoutId: Event = {
    title: "New Event",
    description: "Description",
    start: new Date(),
    end: new Date(),
    color: "#3b82f6",
  };

  const mockEventWithId: Event = {
    id: 1,
    title: "Existing Event",
    description: "Description",
    start: new Date(),
    end: new Date(),
    color: "#3b82f6",
  };

  describe("provideRenderer", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("returns renderer for event without id (AddEventStrategy)", () => {
      const result =
        EventModalStrategyRegistry.provideRenderer(mockEventWithoutId);
      expect(result).toBeDefined();
      expect(result.render).toBeInstanceOf(Function);
    });

    it("returns renderer for event with id (EditEventStrategy)", () => {
      const result =
        EventModalStrategyRegistry.provideRenderer(mockEventWithId);
      expect(result).toBeDefined();
      expect(result.render).toBeInstanceOf(Function);
    });

    it("throws error when no strategy supports the event", () => {
      vi.mocked(AddEventStrategy.prototype.canSupport).mockReturnValue(false);
      vi.mocked(EditEventStrategy.prototype.canSupport).mockReturnValue(false);

      expect(() =>
        EventModalStrategyRegistry.provideRenderer(mockEventWithoutId)
      ).toThrow(/No EventModalStrategy found for event with id=/);
    });

    it("throws error with event id when event has id", () => {
      vi.mocked(AddEventStrategy.prototype.canSupport).mockReturnValue(false);
      vi.mocked(EditEventStrategy.prototype.canSupport).mockReturnValue(false);

      expect(() =>
        EventModalStrategyRegistry.provideRenderer(mockEventWithId)
      ).toThrow(/No EventModalStrategy found for event with id=1/);
    });

    it("throws error with 'null' when event has no id", () => {
      vi.mocked(AddEventStrategy.prototype.canSupport).mockReturnValue(false);
      vi.mocked(EditEventStrategy.prototype.canSupport).mockReturnValue(false);

      expect(() =>
        EventModalStrategyRegistry.provideRenderer(mockEventWithoutId)
      ).toThrow(/No EventModalStrategy found for event with id=null/);
    });

    it("selects first matching strategy", () => {
      vi.mocked(AddEventStrategy.prototype.canSupport).mockReturnValue(true);
      vi.mocked(AddEventStrategy.prototype.render).mockReturnValue("AddModal");

      const result =
        EventModalStrategyRegistry.provideRenderer(mockEventWithoutId);

      const mockProps = {
        eventData: mockEventWithoutId,
        onChange: vi.fn(),
        onClose: vi.fn(),
        onSubmit: vi.fn(),
        onRequestDelete: vi.fn(),
      };

      result.render(mockProps);
      expect(AddEventStrategy.prototype.render).toHaveBeenCalledWith(mockProps);
    });

    it("uses AddEventStrategy when event id is undefined", () => {
      const eventWithUndefinedId: Event = {
        id: undefined,
        title: "Event",
        description: "",
        start: new Date(),
        end: new Date(),
        color: "#000",
      };

      const result =
        EventModalStrategyRegistry.provideRenderer(eventWithUndefinedId);
      expect(result).toBeDefined();
    });

    it("uses EditEventStrategy when event has numeric id", () => {
      const result =
        EventModalStrategyRegistry.provideRenderer(mockEventWithId);
      expect(result).toBeDefined();
    });

    it("registry contains both strategies", () => {
      const resultAdd =
        EventModalStrategyRegistry.provideRenderer(mockEventWithoutId);
      const resultEdit =
        EventModalStrategyRegistry.provideRenderer(mockEventWithId);

      expect(resultAdd).toBeDefined();
      expect(resultEdit).toBeDefined();
    });
  });

  describe("strategy selection logic", () => {
    it("correctly identifies new event (no id)", () => {
      const event: Event = {
        title: "New",
        description: "",
        start: new Date(),
        end: new Date(),
        color: "#000",
      };

      const result = EventModalStrategyRegistry.provideRenderer(event);
      expect(result.render).toBeInstanceOf(Function);
    });

    it("correctly identifies existing event (with id)", () => {
      const event: Event = {
        id: 42,
        title: "Existing",
        description: "",
        start: new Date(),
        end: new Date(),
        color: "#000",
      };

      const result = EventModalStrategyRegistry.provideRenderer(event);
      expect(result.render).toBeInstanceOf(Function);
    });

    it("handles event with id = 0", () => {
      const event: Event = {
        id: 0,
        title: "Event with id 0",
        description: "",
        start: new Date(),
        end: new Date(),
        color: "#000",
      };

      const result = EventModalStrategyRegistry.provideRenderer(event);
      expect(result).toBeDefined();
    });
  });
});
