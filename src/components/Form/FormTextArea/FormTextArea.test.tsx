import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { FormTextArea } from "./FormTextArea";

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

describe("FormTextArea", () => {
  it("should render textarea element", () => {
    render(
      <FormWrapper>
        <FormTextArea name="test" />
      </FormWrapper>
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should register with react-hook-form", () => {
    render(
      <FormWrapper defaultValues={{ description: "Initial value" }}>
        <FormTextArea name="description" />
      </FormWrapper>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("name", "description");
  });

  it("should pass additional textarea attributes", () => {
    render(
      <FormWrapper>
        <FormTextArea
          name="test"
          placeholder="Enter description"
          rows={5}
          cols={40}
          disabled
        />
      </FormWrapper>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("placeholder", "Enter description");
    expect(textarea).toHaveAttribute("rows", "5");
    expect(textarea).toHaveAttribute("cols", "40");
    expect(textarea).toBeDisabled();
  });

  it("should handle value changes", () => {
    render(
      <FormWrapper>
        <FormTextArea name="test" />
      </FormWrapper>
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "New text content" } });

    expect(textarea).toHaveValue("New text content");
  });

  it("should display error message when error exists", () => {
    render(
      <FormWrapperWithErrors
        errors={{ test: { message: "Description is required" } }}
      >
        <FormTextArea name="test" />
      </FormWrapperWithErrors>
    );

    expect(screen.getByText("Description is required")).toBeInTheDocument();
  });

  it("should not display error for other fields", () => {
    render(
      <FormWrapperWithErrors errors={{ other: { message: "Other error" } }}>
        <FormTextArea name="test" />
      </FormWrapperWithErrors>
    );

    expect(screen.queryByText("Other error")).not.toBeInTheDocument();
  });

  it("should handle multiline text", () => {
    render(
      <FormWrapper>
        <FormTextArea name="test" />
      </FormWrapper>
    );

    const textarea = screen.getByRole("textbox");
    const multilineText = "Line 1\nLine 2\nLine 3";
    fireEvent.change(textarea, { target: { value: multilineText } });

    expect(textarea).toHaveValue(multilineText);
  });

  it("should support maxLength attribute", () => {
    render(
      <FormWrapper>
        <FormTextArea name="test" maxLength={100} />
      </FormWrapper>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("maxLength", "100");
  });

  it("should render as textarea element", () => {
    render(
      <FormWrapper>
        <FormTextArea name="test" />
      </FormWrapper>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea.tagName).toBe("TEXTAREA");
  });
});
