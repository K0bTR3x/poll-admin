import React, { useState, useEffect } from "react";
import { Layout, Drawer, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FiMenu,
    FiHome,
    FiCalendar,
    FiUser,
    FiSun,
    FiMoon,
} from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store/slices/themeSlice/themeSlice";
import { clearToken } from "../../store/slices/authSlice/AuthSlice";
import Swal from "sweetalert2";
import logo from "../../assets/images/logo.png";
import "./Header.scss";

const { Header } = Layout;

const HeaderBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode } = useSelector((state) => state.theme);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "Çıxış etmək istədiyinizdən əminsinizmi?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, çıxış et",
            cancelButtonText: "Ləğv et",
            reverseButtons: true,
            background: darkMode ? "#1e1e2f" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(clearToken());
                Swal.fire({
                    title: "Çıxış edildi!",
                    icon: "success",
                    background: darkMode ? "#1e1e2f" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/");
                });
            }
        });
    };
    const links = [
        { key: "/dashboard", label: "İdarəetmə Paneli", icon: <FiHome /> },
        { key: "/meetings", label: "Tədbirlər", icon: <FiCalendar /> },
        { key: "/profile", label: "Profil", icon: <FiUser /> },
        { key: "/settings", label: "Tənzimləmələr", icon: <IoIosSettings /> },
    ];
    return (
        <Header className="app-header">
            <div className="header-inner">
                <Link to="/dashboard" className="logo">
                    <img width="40" src={logo} alt="Logo" />
                    İdarəetmə Paneli
                </Link>
                {!isMobile && (
                    <nav className="desktop-nav">
                        {links.map((link) => (
                            <Link
                                key={link.key}
                                to={link.key}
                                className={`nav-link ${location.pathname.startsWith(link.key) ? "active" : ""
                                    }`}
                            >
                                {link.icon} {link.label}
                            </Link>
                        ))}
                        <button className="logout-button" onClick={handleLogout}>
                            <CiLogout /> Çıxış
                        </button>

                        <button
                            className="dark-toggle"
                            onClick={() => dispatch(toggleTheme())}
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <FiSun /> : <FiMoon />}
                        </button>
                    </nav>
                )}
                {isMobile && (
                    <>
                        <Button
                            type="text"
                            icon={<FiMenu size={24} />}
                            onClick={() => setDrawerOpen(true)}
                            style={{
                                color: "var(--color-text-dark)",
                            }}
                        />
                        <Drawer
                            title="Navigasiya"
                            placement="right"
                            onClose={() => setDrawerOpen(false)}
                            open={drawerOpen}
                            bodyStyle={{
                                background: "var(--color-header-bg)",
                                color: "var(--color-text-dark)",
                            }}
                        >
                            <nav className="mobile-nav">
                                {links.map((link) => (
                                    <Link
                                        key={link.key}
                                        to={link.key}
                                        className={`nav-link ${location.pathname.startsWith(link.key) ? "active" : ""
                                            }`}
                                        onClick={() => setDrawerOpen(false)}
                                    >
                                        {link.icon} {link.label}
                                    </Link>
                                ))}
                                <button
                                    className="dark-toggle"
                                    onClick={() => {
                                        dispatch(toggleTheme());
                                        setDrawerOpen(false);
                                    }}
                                >
                                    {darkMode ? <FiSun /> : <FiMoon />}
                                </button>
                                <button className="logout-button" onClick={handleLogout}>
                                    <CiLogout /> Çıxış
                                </button>
                            </nav>
                        </Drawer>
                    </>
                )}
            </div>
        </Header>
    );
};

export default HeaderBar;