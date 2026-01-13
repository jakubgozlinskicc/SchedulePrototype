import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SchedulePage from "./SchedulePage";
import { TranslationProvider } from "../../contexts/translationContext/translationProvider";
import { EventDataProvider } from "./eventContext/eventDataProvider";

describe("SchedulePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the schedule page with header", () => {
    render(
      <BrowserRouter>
        <TranslationProvider>
          <EventDataProvider>
            <SchedulePage />
          </EventDataProvider>
        </TranslationProvider>
      </BrowserRouter>
    );

    expect(screen.getByText("Schedule")).toBeInTheDocument();
  });
});
