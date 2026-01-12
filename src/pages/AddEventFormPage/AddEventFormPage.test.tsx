import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AddEventFormPage } from "./AddEventFormPage";

const mockNavigate = vi.fn();
const mockOnSubmit = vi.fn();
const mockHandleCancel = vi.fn();

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
  }),
}));

vi.mock(
  "../../events/form/EventForm/useEventForm/useEventFormSchema/useEventFormSchema",
  () => ({
    useEventFormSchema: () => ({
      eventFormSchema: {
        validate: vi.fn(),
      },
    }),
  })
);

vi.mock(
  "../../events/form/EventForm/useEventForm/useEventFormNavigation/useEventFormNavigation",
  () => ({
    useEventFormNavigation: () => ({
      handleCancel: mockHandleCancel,
    }),
  })
);

vi.mock(
  "../../events/form/EventForm/useEventForm/useEventFormSubmit/useEventFormSubmit",
  () => ({
    useEventFormSubmit: () => ({
      onSubmit: mockOnSubmit,
    }),
  })
);

vi.mock("../../events/form/EventForm/EventFormFields", () => ({
  EventFormFields: () => <div data-testid="event-form-fields">Form Fields</div>,
}));

vi.mock("../../components/Button/Button", () => ({
  Button: ({ children, onClick, type, variant }: any) => (
    <button data-testid={`button-${variant}`} onClick={onClick} type={type}>
      {children}
    </button>
  ),
}));

const renderAddEventFormPage = () => {
  return render(
    <BrowserRouter>
      <AddEventFormPage />
    </BrowserRouter>
  );
};

describe("AddEventFormPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the add event form header", () => {
    renderAddEventFormPage();
    expect(screen.getByText("add_title")).toBeInTheDocument();
  });

  it("should render EventFormFields component", () => {
    renderAddEventFormPage();
    expect(screen.getByTestId("event-form-fields")).toBeInTheDocument();
  });

  it("should render cancel button", () => {
    renderAddEventFormPage();
    const cancelButton = screen.getByTestId("button-secondary");
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent("btn_cancel");
  });

  it("should render submit button with add text", () => {
    renderAddEventFormPage();
    const submitButton = screen.getByTestId("button-primary");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("btn-add");
  });

  it("should call handleCancel when cancel button is clicked", () => {
    renderAddEventFormPage();
    const cancelButton = screen.getByTestId("button-secondary");
    fireEvent.click(cancelButton);
    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it("should have correct form structure", () => {
    const { container } = renderAddEventFormPage();
    expect(container.querySelector(".event-form-page")).toBeInTheDocument();
    expect(container.querySelector(".event-form-header")).toBeInTheDocument();
    expect(container.querySelector(".form-wrapper")).toBeInTheDocument();
    expect(container.querySelector(".form-content")).toBeInTheDocument();
    expect(container.querySelector(".event-form")).toBeInTheDocument();
  });

  it("should have form actions section", () => {
    const { container } = renderAddEventFormPage();
    expect(container.querySelector(".event-form-actions")).toBeInTheDocument();
  });

  it("should render calendar plus icon in submit button", () => {
    const { container } = renderAddEventFormPage();
    const icon = container.querySelector(".fa-calendar-plus");
    expect(icon).toBeInTheDocument();
  });

  it("should render xmark icon in cancel button", () => {
    const { container } = renderAddEventFormPage();
    const icon = container.querySelector(".fa-xmark");
    expect(icon).toBeInTheDocument();
  });

  it("should have submit button with type submit", () => {
    renderAddEventFormPage();
    const submitButton = screen.getByTestId("button-primary");
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should not render delete button", () => {
    const { container } = renderAddEventFormPage();
    expect(container.querySelector(".fa-trash-can")).not.toBeInTheDocument();
  });
});
