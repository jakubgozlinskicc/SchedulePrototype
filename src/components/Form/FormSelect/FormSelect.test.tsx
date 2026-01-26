import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { FormSelect } from "./FormSelect";

interface WrapperProps {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}

function FormWrapper({ children, defaultValues = {} }: WrapperProps) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

function FormWrapperWithErrors({
  children,
  errors,
}: {
  children: React.ReactNode;
  errors: Record<string, { message: string }>;
}) {
  const methods = useForm();

  Object.entries(errors).forEach(([name, error]) => {
    methods.setError(name, error);
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("FormSelect", () => {
  it("should render select element", () => {
    render(
      <FormWrapper>
        <FormSelect name="test" options={mockOptions} />
      </FormWrapper>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should render all options", () => {
    render(
      <FormWrapper>
        <FormSelect name="test" options={mockOptions} />
      </FormWrapper>
    );

    expect(
      screen.getByRole("option", { name: "Option 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option 2" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Option 3" })
    ).toBeInTheDocument();
  });

  it("should register with react-hook-form", () => {
    render(
      <FormWrapper>
        <FormSelect name="category" options={mockOptions} />
      </FormWrapper>
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("name", "category");
  });

  it("should handle value changes", () => {
    render(
      <FormWrapper>
        <FormSelect name="test" options={mockOptions} />
      </FormWrapper>
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "option2" } });

    expect(select).toHaveValue("option2");
  });

  it("should display error message when error exists", () => {
    render(
      <FormWrapperWithErrors
        errors={{ test: { message: "Please select an option" } }}
      >
        <FormSelect name="test" options={mockOptions} />
      </FormWrapperWithErrors>
    );

    expect(screen.getByText("Please select an option")).toBeInTheDocument();
  });

  it("should not display error for other fields", () => {
    render(
      <FormWrapperWithErrors errors={{ other: { message: "Other error" } }}>
        <FormSelect name="test" options={mockOptions} />
      </FormWrapperWithErrors>
    );

    expect(screen.queryByText("Other error")).not.toBeInTheDocument();
  });

  it("should render options with correct values", () => {
    const numericOptions = [
      { value: 1, label: "One" },
      { value: 2, label: "Two" },
    ];

    render(
      <FormWrapper>
        <FormSelect name="test" options={numericOptions} />
      </FormWrapper>
    );

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveValue("1");
    expect(options[1]).toHaveValue("2");
  });

  it("should pass additional select attributes", () => {
    render(
      <FormWrapper>
        <FormSelect
          name="test"
          options={mockOptions}
          disabled
          aria-label="Test select"
        />
      </FormWrapper>
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("aria-label", "Test select");
  });

  it("should handle empty options array", () => {
    render(
      <FormWrapper>
        <FormSelect name="test" options={[]} />
      </FormWrapper>
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});
