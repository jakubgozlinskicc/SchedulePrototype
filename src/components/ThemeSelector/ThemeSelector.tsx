import { useTranslation } from "react-i18next";
import { Selector } from "../Selector/Selector";
import { useThemeSelector } from "./useThemeSelector/useThemeSeletor";

export const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes } = useThemeSelector();
  const { t } = useTranslation();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    changeTheme(e.target.value);
  };

  return (
    <Selector currentLanguage={currentTheme} onChange={handleThemeChange}>
      {Object.entries(themes).map(([key, theme]) => (
        <option key={key} value={key}>
          {t(theme.name)}
        </option>
      ))}
    </Selector>
  );
};
