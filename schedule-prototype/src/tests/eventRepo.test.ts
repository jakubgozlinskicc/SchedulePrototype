import { describe, it, expect, beforeEach } from "vitest";
import {
  getEvents,
  addEvent,
  editEvent,
  deleteEvent,
  clearEvents,
} from "../db/eventRepository";
import { type Event } from "../db/scheduleDb";

describe("Event Repository", () => {
  beforeEach(async () => {
    await clearEvents();
  });

  it("Dodaje i odczytuje Event", async () => {
    const event: Omit<Event, "id"> = {
      title: "Spotkanie testowe",
      description: "Opis spotkania",
      start: new Date(),
      end: new Date(),
      color: "#ffffff",
    };

    const id = await addEvent(event);

    expect(id).toBeGreaterThan(0);

    const events = await getEvents();

    expect(events).toHaveLength(1);

    const saved = events[0];

    expect(saved.id).toBe(id);
    expect(saved.title).toBe(event.title);
    expect(saved.description).toBe(event.description);
    expect(saved.color).toBe(event.color);
    expect(saved.end.getTime()).toBe(event.end.getTime());
    expect(saved.start.getTime()).toBe(event.start.getTime());
  });

  it("Edytuje istniejący element, bez koniecznosci zmiany wszystkich", async () => {
    const now = new Date();
    const later = new Date(now.getTime() + 10000);

    const baseEvent: Omit<Event, "id"> = {
      title: "stary tytul",
      description: "stary opis",
      color: "#ffffff",
      start: now,
      end: now,
    };
    const id = await addEvent(baseEvent);

    await editEvent(id, {
      title: "nowy tytul",
      description: "nowy opis",
      color: "#000000",
      end: later,
    });

    const events = await getEvents();
    const edited = events[0];

    expect(edited.id).toBe(id);
    expect(edited.title).toBe("nowy tytul");
    expect(edited.description).toBe("nowy opis");
    expect(edited.color).toBe("#000000");
    expect(edited.end.getTime()).toBe(later.getTime());

    expect(edited.start.getTime()).toBe(now.getTime());
  });

  it("Usuwa pojedynczy element po id", async () => {
    const event1: Omit<Event, "id"> = {
      title: "wywal",
      description: "Opis spotkania",
      start: new Date(),
      end: new Date(),
      color: "#fffffff",
    };

    const event2: Omit<Event, "id"> = {
      title: "zostaw",
      description: "Opis spotkania",
      start: new Date(),
      end: new Date(),
      color: "#fffffff",
    };

    const id1 = await addEvent(event1);
    const id2 = await addEvent(event2);

    await deleteEvent(id1);

    const events = await getEvents();

    expect(events).toHaveLength(1);
    expect(events[0].id).toBe(id2);
    expect(events[0].title).toBe("zostaw");
  });
  it("Czyści wszystkie Eventy", async () => {
    const event1: Omit<Event, "id"> = {
      title: "wywal",
      description: "Opis spotkania",
      start: new Date(),
      end: new Date(),
      color: "#fffffff",
    };

    const event2: Omit<Event, "id"> = {
      title: "zostaw",
      description: "Opis spotkania",
      start: new Date(),
      end: new Date(),
      color: "#fffffff",
    };

    await addEvent(event1);
    await addEvent(event2);

    await clearEvents();
    const events = await getEvents();

    expect(events).toHaveLength(0);
  });
});
