import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EditEventFormPage } from "./EditEventFormPage";
import type { Event } from "../../db/scheduleDb";

const mockNavigate = vi.fn();
const mockOnSubmit = vi.fn();
const mockHandleCancel = vi.fn();
const mockHandleDelete = vi.fn();

const mockEvent: Event = {
  id: 1,
  title: "Test Event",
  description: "Test Description",
  start: new Date("2025-12-10T10:00:00"),
  end: new Date("2025-12-10T11:00:00"),
  color: "#0000FF",
  recurrenceRule: {
    type: "none",
    interval: 0,
  },
};

let mockLoading = false;
let mockEventData: Event | undefined = mockEvent;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
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

vi.mock("./useEventLoader", () => ({
  useEventLoader: () => ({
    event: mockEventData,
    loading: mockLoading,
  }),
}));

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

vi.mock(
  "../../events/form/EventForm/useEventForm/useEventFormDelete/useEventFormDelete",
  () => ({
    useEventFormDelete: () => ({
      handleDelete: mockHandleDelete,
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

const renderEditEventFormPage = () => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditEventFormPage />} />
      </Routes>
    </BrowserRouter>
  );
};

describe("EditEventFormPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoading = false;
    mockEventData = mockEvent;
  });

  it("should render loading state when loading is true", () => {
    mockLoading = true;
    renderEditEventFormPage();
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("should render error when event is not found", () => {
    mockEventData = undefined;
    renderEditEventFormPage();
    expect(screen.getByText("error-event-not-found")).toBeInTheDocument();
  });

  it("should render the edit event form header", () => {
    renderEditEventFormPage();
    expect(screen.getByText("edit_title")).toBeInTheDocument();
  });

  it("should render EventFormFields component", () => {
    renderEditEventFormPage();
    expect(screen.getByTestId("event-form-fields")).toBeInTheDocument();
  });

  it("should render delete button", () => {
    renderEditEventFormPage();
    const deleteButton = screen.getByTestId("button-danger");
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveTextContent("btn_delete");
  });

  it("should render cancel button", () => {
    renderEditEventFormPage();
    const cancelButton = screen.getByTestId("button-secondary");
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent("btn_cancel");
  });

  it("should render submit button with save changes text", () => {
    renderEditEventFormPage();
    const submitButton = screen.getByTestId("button-primary");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("btn_save_changes");
  });

  it("should call handleDelete when delete button is clicked", () => {
    renderEditEventFormPage();
    const deleteButton = screen.getByTestId("button-danger");
    fireEvent.click(deleteButton);
    expect(mockHandleDelete).toHaveBeenCalledWith(false);
  });

  it("should call handleCancel when cancel button is clicked", () => {
    renderEditEventFormPage();
    const cancelButton = screen.getByTestId("button-secondary");
    fireEvent.click(cancelButton);
    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it("should have correct form structure", () => {
    const { container } = renderEditEventFormPage();
    expect(container.querySelector(".event-form-page")).toBeInTheDocument();
    expect(container.querySelector(".event-form-header")).toBeInTheDocument();
    expect(container.querySelector(".form-wrapper")).toBeInTheDocument();
    expect(container.querySelector(".form-content")).toBeInTheDocument();
    expect(container.querySelector(".event-form")).toBeInTheDocument();
  });

  it("should have form actions section", () => {
    const { container } = renderEditEventFormPage();
    expect(container.querySelector(".event-form-actions")).toBeInTheDocument();
  });

  it("should render trash can icon in delete button", () => {
    const { container } = renderEditEventFormPage();
    const icon = container.querySelector(".fa-trash-can");
    expect(icon).toBeInTheDocument();
  });

  it("should render xmark icon in cancel button", () => {
    const { container } = renderEditEventFormPage();
    const icon = container.querySelector(".fa-xmark");
    expect(icon).toBeInTheDocument();
  });

  it("should render floppy disk icon in submit button", () => {
    const { container } = renderEditEventFormPage();
    const icon = container.querySelector(".fa-floppy-disk");
    expect(icon).toBeInTheDocument();
  });

  it("should have delete button with type button", () => {
    renderEditEventFormPage();
    const deleteButton = screen.getByTestId("button-danger");
    expect(deleteButton).toHaveAttribute("type", "button");
  });

  it("should have cancel button with type button", () => {
    renderEditEventFormPage();
    const cancelButton = screen.getByTestId("button-secondary");
    expect(cancelButton).toHaveAttribute("type", "button");
  });

  it("should have submit button with type submit", () => {
    renderEditEventFormPage();
    const submitButton = screen.getByTestId("button-primary");
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should not render form when loading", () => {
    mockLoading = true;
    const { container } = renderEditEventFormPage();
    expect(container.querySelector(".event-form")).not.toBeInTheDocument();
  });

  it("should not render form when event is not found", () => {
    mockEventData = undefined;
    const { container } = renderEditEventFormPage();
    expect(container.querySelector(".event-form")).not.toBeInTheDocument();
  });
});
