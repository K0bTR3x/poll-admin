import React from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../layout/header/Header';
import Footer from '../layout/footer/Footer';
import "./Root.scss";
import { useSelector } from "react-redux";

const Root = () => {
    const location = useLocation();
    const hideLayoutRoutes = ['/'];
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);
    const { darkMode } = useSelector((state) => state.theme);

    return (
        <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
            <div className="root">
                <div className="root__right full-width">
                    {!shouldHideLayout && <Header />}
                    <Outlet />
                    {!shouldHideLayout && <Footer />}
                </div>
            </div>
        </div>
    );
}

export default Root;
