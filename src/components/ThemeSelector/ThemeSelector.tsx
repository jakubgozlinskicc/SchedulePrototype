import styles from "./ThemeSelector.module.css";
import { Button } from "../Button/Button";
import { useThemeSelector } from "./useThemeSelector/useThemeSeletor";

export const ThemeSelector = () => {
  const {
    isOpen,
    toggleOpen,
    containerRef,
    currentTheme,
    changeTheme,
    themes,
  } = useThemeSelector();

  return (
    <div ref={containerRef} className={styles.themeSelector}>
      <Button variant="primary" onClick={toggleOpen}>
        <span
          className={styles.currentDot}
          style={{ backgroundColor: themes[currentTheme].primaryHover }}
        />
      </Button>
      <div className={`${styles.themeDropdown} ${isOpen ? styles.open : ""}`}>
        <div className={styles.themeOptions}>
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              type="button"
              onClick={() => changeTheme(key)}
              className={`${styles.themeOption} ${
                currentTheme === key ? styles.selected : ""
              }`}
            >
              <span
                className={styles.optionDot}
                style={{ backgroundColor: theme.primaryHover }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
