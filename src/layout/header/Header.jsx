import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store/slices/themeSlice/themeSlice"; // dark mode reducer
import "./Header.scss";
import logo from "../../assets/images/logo.png";
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { darkMode } = useSelector((state) => state.theme);
    const dispatch = useDispatch();

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const handleDarkMode = () => dispatch(toggleTheme());

    return (
        <header className={`app-header ${darkMode ? "dark" : "light"}`}>
            <div className="logo">
                <img width="40px" src={logo} alt="" />
                <Link to="/dashboard"> İdarəetmə Paneli</Link>
            </div>

            <nav className={`nav ${menuOpen ? "open" : ""}`}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
                <NavLink to="/events" className={({ isActive }) => isActive ? "active" : ""}>Tədbirlər</NavLink>
                <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>İstifadəçilər</NavLink>
                <button onClick={handleDarkMode} className="dark-toggle">
                    {darkMode ? <FiSun /> : <FiMoon />}
                </button>
            </nav>

            <div className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? <FiX /> : <FiMenu />}
            </div>
        </header>
    );
};

export default Header;
