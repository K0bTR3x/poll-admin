// Footer.jsx
import React from "react";
import { useSelector } from "react-redux";
import "./Footer.scss";

const FooterBar = () => {
    const { darkMode, themeColor } = useSelector((state) => state.theme);
    return (
        <footer
            className={`app-footer ${darkMode ? "dark" : "light"}`}
        >
            <p>© {new Date().getFullYear()} Anket İdarəetmə Mərkəzi. All rights reserved.</p>
        </footer>
    );
};

export default FooterBar;
