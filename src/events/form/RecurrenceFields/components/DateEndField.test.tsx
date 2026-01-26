import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { DateEndField } from "./DateEndField";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: {
      recurrenceEndDate: "",
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("DateEndField", () => {
  it("should render label", () => {
    render(
      <FormWrapper>
        <DateEndField />
      </FormWrapper>
    );

    expect(screen.getByText("recurrence-end-date-label")).toBeInTheDocument();
  });

  it("should render date input", () => {
    render(
      <FormWrapper>
        <DateEndField />
      </FormWrapper>
    );

    const input = document.querySelector('input[type="date"]');
    expect(input).toBeInTheDocument();
  });

  it("should have correct name attribute", () => {
    render(
      <FormWrapper>
        <DateEndField />
      </FormWrapper>
    );

    const input = document.querySelector('input[name="recurrenceEndDate"]');
    expect(input).toBeInTheDocument();
  });

  it("should have correct id", () => {
    render(
      <FormWrapper>
        <DateEndField />
      </FormWrapper>
    );

    const input = document.querySelector("#recurrenceEndDate");
    expect(input).toBeInTheDocument();
  });

  it("should have label with correct htmlFor", () => {
    render(
      <FormWrapper>
        <DateEndField />
      </FormWrapper>
    );

    const label = screen.getByText("recurrence-end-date-label");
    expect(label).toHaveAttribute("for", "recurrenceEndDate");
  });
});
