import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "./FormInput";

interface WrapperProps {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
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

describe("FormInput", () => {
  it("should render input element", () => {
    render(
      <FormWrapper>
        <FormInput name="test" />
      </FormWrapper>
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should register with react-hook-form", () => {
    render(
      <FormWrapper defaultValues={{ username: "john" }}>
        <FormInput name="username" />
      </FormWrapper>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", "username");
  });

  it("should pass additional input attributes", () => {
    render(
      <FormWrapper>
        <FormInput
          name="email"
          type="email"
          placeholder="Enter email"
          disabled
        />
      </FormWrapper>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "Enter email");
    expect(input).toBeDisabled();
  });

  it("should handle value changes", () => {
    render(
      <FormWrapper>
        <FormInput name="test" />
      </FormWrapper>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(input).toHaveValue("new value");
  });

  it("should display error message when error exists", () => {
    render(
      <FormWrapperWithErrors
        errors={{ test: { message: "Field is required" } }}
      >
        <FormInput name="test" />
      </FormWrapperWithErrors>
    );

    expect(screen.getByText("Field is required")).toBeInTheDocument();
  });

  it("should not display error for other fields", () => {
    render(
      <FormWrapperWithErrors errors={{ other: { message: "Other error" } }}>
        <FormInput name="test" />
      </FormWrapperWithErrors>
    );

    expect(screen.queryByText("Other error")).not.toBeInTheDocument();
  });
});
