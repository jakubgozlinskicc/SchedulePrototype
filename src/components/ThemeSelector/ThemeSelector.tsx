import { ColorLoader } from "./ColorLoader/ColorLoader";
import styles from "./ThemeSelector.module.css";
import { Button } from "../Button/Button";
import { useThemeSelector } from "./useThemeSelector/useThemeSeletor";

export const ThemeSelector = () => {
  const {
    isOpen,
    setIsOpen,
    currentTheme,
    changeTheme,
    themes,
    loaderTrigger,
    loaderColor,
  } = useThemeSelector();

  return (
    <>
      <ColorLoader color={loaderColor} trigger={loaderTrigger} />
      <div className={styles.themeSelector}>
        <Button variant="primary" onClick={() => setIsOpen(!isOpen)}>
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
    </>
  );
};
