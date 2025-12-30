import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OverviewPage from "./OverviewPage";
import { TranslationProvider } from "../../contexts/translationContext/translationProvider";
import { EventDataProvider } from "../../events/eventContext/eventDataProvider";

const mockNavigate = vi.fn();
const mockChangeLanguage = vi.fn();

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
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

vi.mock("../../locales/useTranslationContext", () => ({
  useTranslationContext: () => ({
    currentLanguage: "enUS",
    changeLanguage: mockChangeLanguage,
  }),
}));

const renderOverviewPage = () => {
  return render(
    <BrowserRouter>
      <TranslationProvider>
        <EventDataProvider>
          <OverviewPage />
        </EventDataProvider>
      </TranslationProvider>
    </BrowserRouter>
  );
};

describe("OverviewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the overview header", () => {
    renderOverviewPage();
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("should render schedule button with calendar icon", () => {
    const { container } = renderOverviewPage();
    expect(screen.getByText("Schedule")).toBeInTheDocument();
    expect(container.querySelector(".fa-calendar")).toBeInTheDocument();
  });

  it("should render list icon", () => {
    const { container } = renderOverviewPage();
    expect(container.querySelector(".fa-list")).toBeInTheDocument();
  });

  it("should render language select with options", () => {
    renderOverviewPage();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("PL")).toBeInTheDocument();
  });

  it("should render events section", () => {
    renderOverviewPage();
    expect(screen.getByText("events")).toBeInTheDocument();
  });

  it("should navigate to schedule page when schedule button is clicked", () => {
    renderOverviewPage();
    fireEvent.click(screen.getByText("Schedule"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should call changeLanguage when selecting different option", () => {
    renderOverviewPage();
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "pl" } });
    expect(mockChangeLanguage).toHaveBeenCalledWith("pl");
  });

  it("should not display date filters when not set", () => {
    renderOverviewPage();
    expect(screen.queryByText(/date-from:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/date-to:/i)).not.toBeInTheDocument();
  });
});
