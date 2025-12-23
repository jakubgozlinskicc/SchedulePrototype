import { NavLink } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  return (
    <nav className="sidebar">
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
