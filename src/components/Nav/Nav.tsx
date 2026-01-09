import { NavLink } from "react-router-dom";
import "./Nav.css";
import { useNavigateToAddEvent } from "./useNavigation/useNavigateToAddEvent/useNavigateToAddEvent";
import { useTranslationContext } from "../../locales/useTranslationContext";
import type { Language } from "../../contexts/translationContext/translationContext";
import { Selector } from "../Selector/Selector";

const Nav = () => {
  const { handleAddEventClick } = useNavigateToAddEvent();
  const { currentLanguage, changeLanguage } = useTranslationContext();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
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
      <ul className="sidebar-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-regular fa-calendar"></i>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/overview"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-solid fa-list"></i>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/event/add"
            onClick={handleAddEventClick}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-solid fa-calendar-plus"></i>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
