import { NavLink } from "react-router-dom";
import "./Nav.css";
import { useNavigateToAddEvent } from "./useNavigation/useNavigateToAddEvent/useNavigateToAddEvent";
import { useTranslationContext } from "../../locales/useTranslationContext";
import type { Language } from "../../contexts/translationContext/translationContext";
import { Selector } from "../Selector/Selector";
import { ThemeSelector } from "../ThemeSelector/ThemeSelector";
import { useTranslation } from "react-i18next";
import { CityPicker } from "../CityPicker/CityPicker";

const Nav = () => {
  const { handleAddEventClick } = useNavigateToAddEvent();
  const { currentLanguage, changeLanguage } = useTranslationContext();
  const { t } = useTranslation();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    changeLanguage(event.target.value as Language);
  };
  return (
    <nav className="sidebar">
      <Selector
        currentLanguage={currentLanguage}
        onChange={handleLanguageChange}
      >
        <option value="enUS">EN</option>
        <option value="pl">PL</option>
      </Selector>
      <ThemeSelector />
      <CityPicker />
      <ul className="sidebar-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            data-tooltip={t("schedule")}
          >
            <i className="fa-regular fa-calendar"></i>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/overview"
            className={({ isActive }) => (isActive ? "active" : "")}
            data-tooltip={t("overview")}
          >
            <i className="fa-solid fa-list"></i>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/event/add"
            onClick={handleAddEventClick}
            className={({ isActive }) => (isActive ? "active" : "")}
            data-tooltip={t("add_title")}
          >
            <i className="fa-regular fa-calendar-plus"></i>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
