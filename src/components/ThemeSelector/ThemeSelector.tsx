import { useTranslation } from "react-i18next";
import { Selector } from "../Selector/Selector";
import { ColorLoader } from "./ColorLoader/ColorLoader";
import { useThemeSelector } from "./useThemeSelector/useThemeSeletor";

export const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes, loaderTrigger, loaderColor } =
    useThemeSelector();
  const { t } = useTranslation();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    changeTheme(e.target.value);
  };

  return (
    <>
      <ColorLoader color={loaderColor} trigger={loaderTrigger} />
      <Selector currentLanguage={currentTheme} onChange={handleThemeChange}>
        {Object.entries(themes).map(([key, theme]) => (
          <option key={key} value={key}>
            {t(theme.name)}
          </option>
        ))}
      </Selector>
    </>
  );
};
