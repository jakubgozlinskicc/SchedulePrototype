import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TopControls } from "./TopControls";
import styles from "./TopControls.module.css";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("TopControls", () => {
  const defaultProps = {
    buttonText: "Go Back",
    buttonIcon: "fa-solid fa-arrow-left",
    navigateTo: "/home",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render button with text", () => {
    renderWithRouter(<TopControls {...defaultProps} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("should render button with icon", () => {
    const { container } = renderWithRouter(<TopControls {...defaultProps} />);

    expect(
      container.querySelector(".fa-solid.fa-arrow-left")
    ).toBeInTheDocument();
  });

  it("should apply topControls class to container", () => {
    const { container } = renderWithRouter(<TopControls {...defaultProps} />);

    expect(
      container.querySelector(`.${styles.topControls}`)
    ).toBeInTheDocument();
  });

  it("should navigate when button is clicked", () => {
    renderWithRouter(<TopControls {...defaultProps} />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("should navigate to correct path", () => {
    renderWithRouter(
      <TopControls {...defaultProps} navigateTo="/different-path" />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockNavigate).toHaveBeenCalledWith("/different-path");
  });

  it("should render children", () => {
    renderWithRouter(
      <TopControls {...defaultProps}>
        <span>Additional Content</span>
      </TopControls>
    );

    expect(screen.getByText("Additional Content")).toBeInTheDocument();
  });

  it("should render multiple children", () => {
    renderWithRouter(
      <TopControls {...defaultProps}>
        <button>Extra Button 1</button>
        <button>Extra Button 2</button>
      </TopControls>
    );

    expect(screen.getByText("Extra Button 1")).toBeInTheDocument();
    expect(screen.getByText("Extra Button 2")).toBeInTheDocument();
  });

  it("should render without children", () => {
    const { container } = renderWithRouter(<TopControls {...defaultProps} />);

    const topControls = container.querySelector(`.${styles.topControls}`);
    expect(topControls?.children).toHaveLength(1);
  });

  it("should display different button text", () => {
    renderWithRouter(<TopControls {...defaultProps} buttonText="Schedule" />);

    expect(screen.getByText("Schedule")).toBeInTheDocument();
  });

  it("should render different icon", () => {
    const { container } = renderWithRouter(
      <TopControls {...defaultProps} buttonIcon="fa-regular fa-calendar" />
    );

    expect(
      container.querySelector(".fa-regular.fa-calendar")
    ).toBeInTheDocument();
  });

  it("should render select as child", () => {
    renderWithRouter(
      <TopControls {...defaultProps}>
        <select data-testid="language-select">
          <option value="en">EN</option>
          <option value="pl">PL</option>
        </select>
      </TopControls>
    );

    expect(screen.getByTestId("language-select")).toBeInTheDocument();
  });

  it("should call navigate only once per click", () => {
    renderWithRouter(<TopControls {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
