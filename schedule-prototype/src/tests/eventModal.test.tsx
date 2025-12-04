import { describe, it, expect, vi } from "vitest";
import type { Event } from "../db/scheduleDb";
import { EventModal } from "../components/eventModal";
import { render, screen, fireEvent } from "@testing-library/react";

type EventData = Omit<Event, "id">;

type EventModalProps = React.ComponentProps<typeof EventModal>;

const baseEvent: EventData = {
  title: "test",
  description: "test",
  start: new Date(),
  end: new Date(),
  color: "#ffffff",
};

function renderModal(overrides: Partial<EventModalProps> = {}) {
  const props: EventModalProps = {
    isOpen: true,
    mode: "view",
    editingEventId: 1,
    eventData: baseEvent,
    isShaking: false,
    onChange: vi.fn(),
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    onRequestEdit: vi.fn(),
    onRequestDelete: vi.fn(),
    ...overrides,
  };

  return { props, ...render(<EventModal {...props} />) };
}

describe("eventModal", () => {
  it("w trybie edit nie ma przycisków Edytuj i Usuń", () => {
    renderModal({ mode: "edit" });

    expect(screen.queryByText("Edytuj")).toBeNull();
    expect(screen.queryByText("Usuń")).toBeNull();
  });

  it("w trybie view SĄ przyciski Edytuj i Usuń", () => {
    renderModal({ mode: "view" });

    expect(screen.getByText("Edytuj")).toBeInTheDocument();
    expect(screen.getByText("Usuń")).toBeInTheDocument();
  });

  it("onChange wywołuje callback", () => {
    const onChange = vi.fn();
    renderModal({ mode: "edit", onChange });

    const [titleInput] = screen.getAllByRole("textbox");

    fireEvent.change(titleInput, {
      target: { value: "test1" },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it("onSubmit wywołuje callback", () => {
    const onSubmit = vi.fn();
    renderModal({ mode: "edit", onSubmit });

    const submitButton = screen.getByRole("button", {
      name: /Dodaj|Zapisz zmiany/i,
    });
    const form = submitButton.closest("form")!;
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalled();
  });

  it("onClose wywoluje callback po kliknięciu Anuluj/Zamknij", () => {
    const onClose = vi.fn();

    renderModal({ mode: "edit", onClose });
    fireEvent.click(screen.getByText("Anuluj"));
    expect(onClose).toHaveBeenCalledTimes(1);

    renderModal({ mode: "view", onClose });
    fireEvent.click(screen.getByText("Zamknij"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
