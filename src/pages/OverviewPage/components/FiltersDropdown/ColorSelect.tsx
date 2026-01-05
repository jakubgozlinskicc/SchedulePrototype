import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./ColorSelect.css";

const COLOR_OPTIONS = [
  { key: "red", sample: "#FF0000" },
  { key: "orange", sample: "#FF8C00" },
  { key: "yellow", sample: "#FFFF00" },
  { key: "green", sample: "#00AA00" },
  { key: "blue", sample: "#0066FF" },
  { key: "purple", sample: "#800080" },
  { key: "pink", sample: "#FF69B4" },
  { key: "brown", sample: "#8B4513" },
  { key: "cyan", sample: "#00CCCC" },
  { key: "gold", sample: "#FFD700" },
  { key: "black", sample: "#000000" },
  { key: "gray", sample: "#808080" },
  { key: "white", sample: "#FFFFFF" },
] as const;

interface ColorSelectProps {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
}

export function ColorSelect({ selectedColors, onChange }: ColorSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleColor = (colorKey: string) => {
    if (selectedColors.includes(colorKey)) {
      onChange(selectedColors.filter((c) => c !== colorKey));
    } else {
      onChange([...selectedColors, colorKey]);
    }
  };

  const resetColors = () => {
    onChange([]);
  };

  return (
    <div className="color-select">
      <button
        type="button"
        className="color-select-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="color-select-label">
          {selectedColors.length > 0
            ? `${t("colors-selected")}: ${selectedColors.length}`
            : t("select-colors")}
        </span>
        <span className={`color-select-arrow ${isOpen ? "open" : ""}`}>
          <i className="fa-solid fa-arrow-down"></i>
        </span>
      </button>

      {selectedColors.length > 0 && (
        <div className="color-select-preview">
          {selectedColors.map((colorKey) => {
            const color = COLOR_OPTIONS.find((c) => c.key === colorKey);
            return (
              <span
                key={colorKey}
                className="color-preview-dot"
                style={{ backgroundColor: color?.sample }}
              />
            );
          })}
        </div>
      )}

      <div className={`color-select-dropdown ${isOpen ? "open" : ""}`}>
        <div className="color-options-grid">
          {COLOR_OPTIONS.map(({ key, sample }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleColor(key)}
              className={`color-option ${
                selectedColors.includes(key) ? "selected" : ""
              }`}
            >
              <span className="color-dot" style={{ backgroundColor: sample }} />
              <span className="color-check">
                <i className="fa-solid fa-check"></i>
              </span>
            </button>
          ))}
          <button className="color-option" onClick={resetColors}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
