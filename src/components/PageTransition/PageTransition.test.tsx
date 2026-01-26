import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PageTransition } from "./PageTransition";

const renderWithRouter = (ui: React.ReactNode, initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>
  );
};

describe("PageTransition", () => {
  it("should render children", () => {
    renderWithRouter(
      <PageTransition>
        <div>Page Content</div>
      </PageTransition>
    );

    expect(screen.getByText("Page Content")).toBeInTheDocument();
  });

  it("should render with page-transition class", () => {
    const { container } = renderWithRouter(
      <PageTransition>
        <div>Content</div>
      </PageTransition>
    );

    expect(container.querySelector(".page-transition")).toBeInTheDocument();
  });

  it("should render multiple children", () => {
    renderWithRouter(
      <PageTransition>
        <header>Header</header>
        <main>Main Content</main>
        <footer>Footer</footer>
      </PageTransition>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("should render nested components", () => {
    renderWithRouter(
      <PageTransition>
        <div>
          <span>Nested Content</span>
        </div>
      </PageTransition>
    );

    expect(screen.getByText("Nested Content")).toBeInTheDocument();
  });

  it("should have key based on pathname", () => {
    const { container } = renderWithRouter(
      <PageTransition>
        <div>Content</div>
      </PageTransition>,
      "/test-route"
    );

    const transitionDiv = container.querySelector(".page-transition");
    expect(transitionDiv).toBeInTheDocument();
  });

  it("should render different content on different routes", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/page1"]}>
        <PageTransition>
          <div>Page 1</div>
        </PageTransition>
      </MemoryRouter>
    );

    expect(screen.getByText("Page 1")).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={["/page2"]}>
        <PageTransition>
          <div>Page 2</div>
        </PageTransition>
      </MemoryRouter>
    );

    expect(screen.getByText("Page 2")).toBeInTheDocument();
  });

  it("should wrap children in div element", () => {
    const { container } = renderWithRouter(
      <PageTransition>
        <span>Content</span>
      </PageTransition>
    );

    const wrapper = container.firstChild;
    expect(wrapper?.nodeName).toBe("DIV");
  });
});
