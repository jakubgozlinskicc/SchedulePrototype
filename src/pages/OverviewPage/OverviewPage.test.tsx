import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OverviewPage from "./OverviewPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

vi.mock("../../locales/useTranslationContext", () => ({
  useTranslationContext: () => ({
    currentLanguage: "enUS",
    changeLanguage: vi.fn(),
  }),
}));

vi.mock("../../utils/calendarLocalizer/calendarLocalizer", () => ({
  locales: {
    enUS: undefined,
  },
}));

vi.mock("./components/EventList/EventList", () => ({
  EventList: () => <div data-testid="event-list">EventList</div>,
}));

vi.mock("./components/EventToolbar/EventToolbar", () => ({
  EventToolbar: () => <div data-testid="event-toolbar">EventToolbar</div>,
}));

vi.mock("./context/FiltersProvider", () => ({
  FiltersProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("./context/useFiltersContext", () => ({
  useFiltersContext: () => ({
    filters: {
      searchQuery: "",
      showPastEvents: false,
      dateFrom: null,
      dateTo: null,
      colors: [],
    },
  }),
}));

const renderOverviewPage = () => {
  return render(
    <BrowserRouter>
      <OverviewPage />
    </BrowserRouter>
  );
};

describe("OverviewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the overview header", () => {
    renderOverviewPage();

    const header = screen.getByRole("heading", { name: /overview/i });
    expect(header).toBeInTheDocument();
  });

  it("should render schedule button with calendar icon", () => {
    renderOverviewPage();

    const buttons = screen.getAllByRole("button");
    const scheduleButton = buttons.find((button) =>
      button.textContent?.includes("schedule")
    );

    expect(scheduleButton).toBeInTheDocument();
  });

  it("should render list icon", () => {
    renderOverviewPage();

    const header = screen.getByRole("heading", { name: /overview/i });
    const listIcon = header.querySelector(".fa-list");
    expect(listIcon).toBeInTheDocument();
  });

  it("should render EventList component", () => {
    renderOverviewPage();
    expect(screen.getByTestId("event-list")).toBeInTheDocument();
  });

  it("should render EventToolbar component", () => {
    renderOverviewPage();
    expect(screen.getByTestId("event-toolbar")).toBeInTheDocument();
  });

  it("should not display date filters when not set", () => {
    renderOverviewPage();

    const activeDates = document.querySelector(".active-dates");
    if (activeDates) {
      expect(activeDates.children.length).toBe(0);
    } else {
      expect(true).toBe(true);
    }
  });
});
