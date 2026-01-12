import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { EventFormFields } from "./EventFormFields";

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
      title: "",
      description: "",
      start: "",
      end: "",
      color: "#0000FF",
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceEndType: "never",
      ...defaultValues,
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("EventFormFields", () => {
  it("should render title field", () => {
    render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    expect(screen.getByText("title")).toBeInTheDocument();
  });

  it("should render description field", () => {
    render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    expect(screen.getByText("description")).toBeInTheDocument();
  });

  it("should render start date field", () => {
    render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    expect(screen.getByText("start-date")).toBeInTheDocument();
  });

  it("should render end date field", () => {
    render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    expect(screen.getByText("end-date")).toBeInTheDocument();
  });

  it("should render color field", () => {
    render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    expect(screen.getByText("color")).toBeInTheDocument();
  });

  it("should render recurrence type select", () => {
    render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    expect(screen.getByText("recurrence-type")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should render all recurrence type options", () => {
    render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    expect(
      screen.getByRole("option", { name: "recurrence-none" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "recurrence-daily" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "recurrence-weekly" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "recurrence-monthly" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "recurrence-yearly" })
    ).toBeInTheDocument();
  });

  it("should not render RecurrenceFields when recurrence type is none", () => {
    render(
      <FormWrapper defaultValues={{ recurrenceType: "none" }}>
        <EventFormFields />
      </FormWrapper>
    );

    expect(screen.queryByText("recurrence-interval")).not.toBeInTheDocument();
  });

  it("should render form icons", () => {
    const { container } = render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    expect(container.querySelector(".fa-pen-to-square")).toBeInTheDocument();
    expect(container.querySelector(".fa-bars-staggered")).toBeInTheDocument();
    expect(container.querySelector(".fa-hourglass-start")).toBeInTheDocument();
    expect(container.querySelector(".fa-hourglass-end")).toBeInTheDocument();
    expect(container.querySelector(".fa-palette")).toBeInTheDocument();
    expect(container.querySelector(".fa-repeat")).toBeInTheDocument();
  });

  it("should render color input with correct type", () => {
    render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    const colorInput = document.querySelector('input[type="color"]');
    expect(colorInput).toBeInTheDocument();
  });

  it("should render datetime-local inputs for start and end", () => {
    render(
      <FormWrapper>
        <EventFormFields />
      </FormWrapper>
    );

    const dateInputs = document.querySelectorAll(
      'input[type="datetime-local"]'
    );
    expect(dateInputs).toHaveLength(2);
  });
});
