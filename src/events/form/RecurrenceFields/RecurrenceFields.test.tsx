import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { RecurrenceFields } from "./RecurrenceFields";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

function FormWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({
    defaultValues: {
      recurrenceType: "daily",
      recurrenceInterval: 1,
      recurrenceEndType: "never",
      ...defaultValues,
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("RecurrenceFields", () => {
  it("should render recurrence interval field", () => {
    render(
      <FormWrapper>
        <RecurrenceFields recurrenceEndType="never" />
      </FormWrapper>
    );

    expect(screen.getByText(/recurrence-interval/)).toBeInTheDocument();
  });

  it("should render recurrence end type select", () => {
    render(
      <FormWrapper>
        <RecurrenceFields recurrenceEndType="never" />
      </FormWrapper>
    );

    expect(screen.getByText("recurrence-end-type")).toBeInTheDocument();
  });

  it("should render all end type options", () => {
    render(
      <FormWrapper>
        <RecurrenceFields recurrenceEndType="never" />
      </FormWrapper>
    );

    expect(
      screen.getByRole("option", { name: "recurrence-end-never" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "recurrence-end-date" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "recurrence-end-count" })
    ).toBeInTheDocument();
  });

  it("should not render additional fields when end type is never", () => {
    render(
      <FormWrapper>
        <RecurrenceFields recurrenceEndType="never" />
      </FormWrapper>
    );

    expect(
      screen.queryByText("recurrence-end-date-label")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("recurrence-count-label")
    ).not.toBeInTheDocument();
  });

  it("should render date field when end type is date", () => {
    render(
      <FormWrapper defaultValues={{ recurrenceEndType: "date" }}>
        <RecurrenceFields recurrenceEndType="date" />
      </FormWrapper>
    );

    expect(screen.getByText("recurrence-end-date-label")).toBeInTheDocument();
  });

  it("should render count field when end type is count", () => {
    render(
      <FormWrapper defaultValues={{ recurrenceEndType: "count" }}>
        <RecurrenceFields recurrenceEndType="count" />
      </FormWrapper>
    );

    expect(screen.getByText("recurrence-count-label")).toBeInTheDocument();
  });

  it("should display correct interval unit for daily", () => {
    render(
      <FormWrapper defaultValues={{ recurrenceType: "daily" }}>
        <RecurrenceFields recurrenceEndType="never" />
      </FormWrapper>
    );

    expect(
      screen.getByText(/recurrence-interval-daily-unit/)
    ).toBeInTheDocument();
  });

  it("should display correct interval unit for weekly", () => {
    render(
      <FormWrapper defaultValues={{ recurrenceType: "weekly" }}>
        <RecurrenceFields recurrenceEndType="never" />
      </FormWrapper>
    );

    expect(
      screen.getByText(/recurrence-interval-weekly-unit/)
    ).toBeInTheDocument();
  });

  it("should render interval input with min and max", () => {
    render(
      <FormWrapper>
        <RecurrenceFields recurrenceEndType="never" />
      </FormWrapper>
    );

    const intervalInput = document.querySelector('input[type="number"]');
    expect(intervalInput).toHaveAttribute("min", "1");
    expect(intervalInput).toHaveAttribute("max", "100");
  });

  it("should render icons", () => {
    const { container } = render(
      <FormWrapper>
        <RecurrenceFields recurrenceEndType="never" />
      </FormWrapper>
    );

    expect(
      container.querySelector(".fa-arrows-left-right")
    ).toBeInTheDocument();
    expect(container.querySelector(".fa-flag-checkered")).toBeInTheDocument();
  });

  it("should have recurrence-fields class", () => {
    const { container } = render(
      <FormWrapper>
        <RecurrenceFields recurrenceEndType="never" />
      </FormWrapper>
    );

    expect(container.querySelector(".recurrence-fields")).toBeInTheDocument();
  });
});
