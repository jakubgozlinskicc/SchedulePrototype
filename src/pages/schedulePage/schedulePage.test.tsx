import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SchedulePage from "./schedulePage";
import { TranslationProvider } from "../../contexts/translationContext/translationProvider";
import { EventDataProvider } from "../../events/eventContext/eventDataProvider";

describe("SchedulePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("It should render the schedule page with header", () => {
    render(
      <TranslationProvider>
        <EventDataProvider>
          <SchedulePage />
        </EventDataProvider>
      </TranslationProvider>
    );

    expect(screen.getByText("Schedule")).toBeInTheDocument();
  });
});
