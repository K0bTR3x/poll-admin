import React, { useState, useEffect } from "react";
import { Layout, Drawer, Button } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiHome, FiCalendar, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store/slices/themeSlice/themeSlice";
import { IoIosSettings } from "react-icons/io";

import logo from "../../assets/images/logo.png";
import "./Header.scss";
const { Header } = Layout;
const HeaderBar = () => {
    const location = useLocation();
    const { darkMode } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const links = [
        { key: "/dashboard", label: "İdarəetmə Paneli", path: "/dashboard", icon: <FiHome /> },
        { key: "/events", label: "Tədbirlər", path: "/events", icon: <FiCalendar /> },
        { key: "/profile", label: "Profil", path: "/profile", icon: <FiUser /> },
        { key: "/settings", label: "Tənzimləmələr", path: "/settings", icon: <IoIosSettings /> }
    ];
    return (
        <Header className="app-header">
            <div className="header-inner">
                <Link to='/dashboard' className="logo">
                    <img width="40" src={logo} alt="" />
                    İdarəetmə Paneli</Link>
                {!isMobile && (
                    <nav className="desktop-nav">
                        {links.map((link) => (
                            <Link
                                key={link.key}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                            >
                                {link.icon} {link.label}
                            </Link>
                        ))}
                        <button className="dark-toggle" onClick={() => dispatch(toggleTheme())}>
                            {darkMode ? <FiSun /> : <FiMoon />}
                        </button>
                    </nav>
                )}

                {isMobile && (
                    <Button type="text" icon={<FiMenu size={24} />} onClick={() => setDrawerOpen(true)} />
                )}

                <Drawer
                    title="Menu"
                    placement="right"
                    onClose={() => setDrawerOpen(false)}
                    open={drawerOpen}
                >
                    <nav className="mobile-nav">
                        {links.map((link) => (
                            <Link
                                key={link.key}
                                to={link.path}
                                className="nav-link"
                                onClick={() => setDrawerOpen(false)}
                            >
                                {link.icon} {link.label}
                            </Link>
                        ))}
                        <button className="dark-toggle" onClick={() => dispatch(toggleTheme())}>
                            {darkMode ? <FiSun /> : <FiMoon />}
                        </button>
                    </nav>
                </Drawer>
            </div>
        </Header>
    );
};

export default HeaderBar;
