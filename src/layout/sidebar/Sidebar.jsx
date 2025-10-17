import React from 'react';
import logo from "../../assets/images/logo.png";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { MdEvent, MdAdminPanelSettings } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoIosExit } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import "./Sidebar.scss";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            İdarəetmə Paneli <MdAdminPanelSettings />
          </NavLink>
        </li>
        <li>
          <NavLink to="/events" className={({ isActive }) => isActive ? "active" : ""}>
            Tədbirlər <MdEvent />
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
            İstifadəçilər <FaUsers />
          </NavLink>
        </li>
        <li>
          <NavLink to="/logout" className={({ isActive }) => isActive ? "active" : ""}>
            Çıxış <IoIosExit />
          </NavLink>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar;
