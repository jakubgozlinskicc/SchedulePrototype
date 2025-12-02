import type { ToolbarProps } from "react-big-calendar";

export function CustomToolbar(props: ToolbarProps) {
  const { label } = props;

  return (
    <div className="custom-toolbar">
      <button className="nav-button" onClick={() => props.onNavigate("TODAY")}>
        Dzisiaj
      </button>
      <button className="nav-button" onClick={() => props.onNavigate("PREV")}>
        ←
      </button>
      <span className="toolbar-label">{label}</span>
      <button className="nav-button" onClick={() => props.onNavigate("NEXT")}>
        →
      </button>

      <div className="view-buttons">
        <button className="nav-button" onClick={() => props.onView("month")}>
          Miesiąc
        </button>
        <button className="nav-button" onClick={() => props.onView("week")}>
          Tydzień
        </button>
        <button className="nav-button" onClick={() => props.onView("day")}>
          Dzień
        </button>
      </div>
    </div>
  );
}
