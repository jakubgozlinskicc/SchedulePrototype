import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EditRecurringEventFormPage } from "./EditRecurringEventFormPage";
import type { Event } from "../../db/scheduleDb";

const mockNavigate = vi.fn();
const mockOnSubmit = vi.fn();
const mockHandleCancel = vi.fn();
const mockHandleDelete = vi.fn();

const mockRecurringEvent: Event = {
  id: 1,
  title: "Recurring Event",
  description: "Test Description",
  start: new Date("2025-12-10T10:00:00"),
  end: new Date("2025-12-10T11:00:00"),
  color: "#0000FF",
  recurrenceRule: {
    type: "daily",
    interval: 1,
  },
};

let mockLoading = false;
let mockEventData: Event | undefined = mockRecurringEvent;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({
      parentId: "1",
      occurrenceDate: encodeURIComponent("2025-12-10T10:00:00"),
    }),
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

vi.mock("./useRecurringEventLoader", () => ({
  useRecurringEventLoader: () => ({
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
  EventFormFields: ({
    isRecurringEditSingle,
  }: {
    isRecurringEditSingle?: boolean;
  }) => (
    <div
      data-testid="event-form-fields"
      data-recurring-single={isRecurringEditSingle}
    >
      Form Fields
    </div>
  ),
}));

vi.mock("./RecurringEditCheckbox/RecurringEditCheckbox", () => ({
  RecurringEditCheckbox: ({
    isEditAll,
    onChange,
  }: {
    isEditAll: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div data-testid="recurring-edit-checkbox">
      <input
        type="checkbox"
        checked={isEditAll}
        onChange={(e) => onChange(e.target.checked)}
        data-testid="edit-all-checkbox"
      />
      <span>Edit all occurrences</span>
    </div>
  ),
}));

vi.mock("./RecurringEditCheckbox/useRecurringEditCheckbox", () => ({
  useRecurringEditCheckBox: () => ({
    isEditAll: false,
    handleChange: vi.fn(),
  }),
}));

vi.mock(
  "../../events/Confirmations/RecurringEventConfirmation/RecurringEventConfirmation",
  () => ({
    RecurringEventConfirmation: ({
      onClose,
      onConfirmSingle,
      onConfirmAll,
    }: {
      variant: string;
      onClose: () => void;
      onConfirmSingle: () => void;
      onConfirmAll: () => void;
    }) => (
      <div data-testid="delete-confirmation">
        <button data-testid="confirm-cancel" onClick={onClose}>
          Cancel
        </button>
        <button data-testid="confirm-single" onClick={onConfirmSingle}>
          Delete Single
        </button>
        <button data-testid="confirm-all" onClick={onConfirmAll}>
          Delete All
        </button>
      </div>
    ),
  })
);

vi.mock("../../components/Button/Button", () => ({
  Button: ({ children, onClick, type, variant }: any) => (
    <button data-testid={`button-${variant}`} onClick={onClick} type={type}>
      {children}
    </button>
  ),
}));

const renderEditRecurringEventFormPage = () => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditRecurringEventFormPage />} />
      </Routes>
    </BrowserRouter>
  );
};

describe("EditRecurringEventFormPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoading = false;
    mockEventData = mockRecurringEvent;
  });

  it("should render loading state when loading is true", () => {
    mockLoading = true;
    renderEditRecurringEventFormPage();
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("should render error when event is not found", () => {
    mockEventData = undefined;
    renderEditRecurringEventFormPage();
    expect(screen.getByText("error-event-not-found")).toBeInTheDocument();
  });

  it("should render the edit recurring event form header", () => {
    renderEditRecurringEventFormPage();
    expect(screen.getByText("edit_recurring_title")).toBeInTheDocument();
  });

  it("should render EventFormFields component", () => {
    renderEditRecurringEventFormPage();
    expect(screen.getByTestId("event-form-fields")).toBeInTheDocument();
  });

  it("should render RecurringEditCheckbox component", () => {
    renderEditRecurringEventFormPage();
    expect(screen.getByTestId("recurring-edit-checkbox")).toBeInTheDocument();
  });

  it("should render delete button", () => {
    renderEditRecurringEventFormPage();
    const deleteButton = screen.getByTestId("button-danger");
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveTextContent("btn_delete");
  });

  it("should render cancel button", () => {
    renderEditRecurringEventFormPage();
    const cancelButton = screen.getByTestId("button-secondary");
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent("btn_cancel");
  });

  it("should render submit button with save changes text", () => {
    renderEditRecurringEventFormPage();
    const submitButton = screen.getByTestId("button-primary");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("btn_save_changes");
  });

  it("should open delete confirmation when delete button is clicked", () => {
    renderEditRecurringEventFormPage();

    expect(screen.queryByTestId("delete-confirmation")).not.toBeInTheDocument();

    const deleteButton = screen.getByTestId("button-danger");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("delete-confirmation")).toBeInTheDocument();
  });

  it("should close delete confirmation when cancel is clicked", () => {
    renderEditRecurringEventFormPage();

    fireEvent.click(screen.getByTestId("button-danger"));
    expect(screen.getByTestId("delete-confirmation")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("confirm-cancel"));
    expect(screen.queryByTestId("delete-confirmation")).not.toBeInTheDocument();
  });

  it("should call handleDelete with false when delete single is clicked", () => {
    renderEditRecurringEventFormPage();

    fireEvent.click(screen.getByTestId("button-danger"));
    fireEvent.click(screen.getByTestId("confirm-single"));

    expect(mockHandleDelete).toHaveBeenCalledWith(false);
  });

  it("should call handleDelete with true when delete all is clicked", () => {
    renderEditRecurringEventFormPage();

    fireEvent.click(screen.getByTestId("button-danger"));
    fireEvent.click(screen.getByTestId("confirm-all"));

    expect(mockHandleDelete).toHaveBeenCalledWith(true);
  });

  it("should call handleCancel when cancel button is clicked", () => {
    renderEditRecurringEventFormPage();
    const cancelButton = screen.getByTestId("button-secondary");
    fireEvent.click(cancelButton);
    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it("should have correct form structure", () => {
    const { container } = renderEditRecurringEventFormPage();
    expect(container.querySelector(".event-form-page")).toBeInTheDocument();
    expect(container.querySelector(".event-form-header")).toBeInTheDocument();
    expect(container.querySelector(".form-wrapper")).toBeInTheDocument();
    expect(container.querySelector(".form-content")).toBeInTheDocument();
    expect(container.querySelector(".event-form")).toBeInTheDocument();
  });

  it("should have form actions section", () => {
    const { container } = renderEditRecurringEventFormPage();
    expect(container.querySelector(".event-form-actions")).toBeInTheDocument();
  });

  it("should render trash can icon in delete button", () => {
    const { container } = renderEditRecurringEventFormPage();
    const icon = container.querySelector(".fa-trash-can");
    expect(icon).toBeInTheDocument();
  });

  it("should render xmark icon in cancel button", () => {
    const { container } = renderEditRecurringEventFormPage();
    const icon = container.querySelector(".fa-xmark");
    expect(icon).toBeInTheDocument();
  });

  it("should render floppy disk icon in submit button", () => {
    const { container } = renderEditRecurringEventFormPage();
    const icon = container.querySelector(".fa-floppy-disk");
    expect(icon).toBeInTheDocument();
  });

  it("should have delete button with type button", () => {
    renderEditRecurringEventFormPage();
    const deleteButton = screen.getByTestId("button-danger");
    expect(deleteButton).toHaveAttribute("type", "button");
  });

  it("should have cancel button with type button", () => {
    renderEditRecurringEventFormPage();
    const cancelButton = screen.getByTestId("button-secondary");
    expect(cancelButton).toHaveAttribute("type", "button");
  });

  it("should have submit button with type submit", () => {
    renderEditRecurringEventFormPage();
    const submitButton = screen.getByTestId("button-primary");
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should not render form when loading", () => {
    mockLoading = true;
    const { container } = renderEditRecurringEventFormPage();
    expect(container.querySelector(".event-form")).not.toBeInTheDocument();
  });

  it("should not render form when event is not found", () => {
    mockEventData = undefined;
    const { container } = renderEditRecurringEventFormPage();
    expect(container.querySelector(".event-form")).not.toBeInTheDocument();
  });

  it("should not show delete confirmation initially", () => {
    renderEditRecurringEventFormPage();
    expect(screen.queryByTestId("delete-confirmation")).not.toBeInTheDocument();
  });
});
