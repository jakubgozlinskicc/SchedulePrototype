// Nav.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Nav from "./Nav";

const mockHandleAddEventClick = vi.fn();

vi.mock("./useNavigation/useNavigateToAddEvent/useNavigateToAddEvent", () => ({
  useNavigateToAddEvent: () => ({
    handleAddEventClick: mockHandleAddEventClick,
  }),
}));

const renderNav = (initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Nav />
    </MemoryRouter>
  );
};

describe("Nav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render navigation sidebar", () => {
    renderNav();

    expect(document.querySelector(".sidebar")).toBeInTheDocument();
  });

  it("should render three navigation links", () => {
    renderNav();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("should render link to home page", () => {
    renderNav();

    expect(document.querySelector('a[href="/"]')).toBeInTheDocument();
  });

  it("should render link to overview page", () => {
    renderNav();

    expect(document.querySelector('a[href="/overview"]')).toBeInTheDocument();
  });

  it("should render link to add event page", () => {
    renderNav();

    expect(document.querySelector('a[href="/event/add"]')).toBeInTheDocument();
  });

  it("should render calendar icon for home link", () => {
    const { container } = renderNav();

    expect(container.querySelector(".fa-calendar")).toBeInTheDocument();
  });

  it("should render list icon for overview link", () => {
    const { container } = renderNav();

    expect(container.querySelector(".fa-list")).toBeInTheDocument();
  });

  it("should render calendar-plus icon for add event link", () => {
    const { container } = renderNav();

    expect(container.querySelector(".fa-calendar-plus")).toBeInTheDocument();
  });

  it("should apply active class to home link when on home page", () => {
    renderNav("/");

    const homeLink = document.querySelector('a[href="/"]');
    expect(homeLink).toHaveClass("active");
  });

  it("should apply active class to overview link when on overview page", () => {
    renderNav("/overview");

    const overviewLink = document.querySelector('a[href="/overview"]');
    expect(overviewLink).toHaveClass("active");
  });

  it("should apply active class to add event link when on add event page", () => {
    renderNav("/event/add");

    const addEventLink = document.querySelector('a[href="/event/add"]');
    expect(addEventLink).toHaveClass("active");
  });

  it("should not apply active class to inactive links", () => {
    renderNav("/overview");

    const homeLink = document.querySelector('a[href="/"]');
    const addEventLink = document.querySelector('a[href="/event/add"]');

    expect(homeLink).not.toHaveClass("active");
    expect(addEventLink).not.toHaveClass("active");
  });

  it("should call handleAddEventClick when add event link is clicked", () => {
    renderNav();

    const addEventLink = document.querySelector('a[href="/event/add"]')!;
    fireEvent.click(addEventLink);

    expect(mockHandleAddEventClick).toHaveBeenCalledTimes(1);
  });

  it("should not call handleAddEventClick when other links are clicked", () => {
    renderNav();

    const homeLink = document.querySelector('a[href="/"]')!;
    const overviewLink = document.querySelector('a[href="/overview"]')!;

    fireEvent.click(homeLink);
    fireEvent.click(overviewLink);

    expect(mockHandleAddEventClick).not.toHaveBeenCalled();
  });

  it("should have correct structure with ul and li elements", () => {
    renderNav();

    const ul = document.querySelector(".sidebar-links");
    expect(ul).toBeInTheDocument();

    const listItems = document.querySelectorAll(".sidebar-links li");
    expect(listItems).toHaveLength(3);
  });
});
