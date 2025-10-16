import React from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from '../layout/header/Header'
import Footer from '../layout/footer/Footer'
import Sidebar from '../layout/sidebar/Sidebar'
import "./Dashboard/Dashboard.scss";
import { useSelector, useStore } from "react-redux";
import "./Root.scss"
const Root = () => {
    const location = useLocation()
    const hideLayoutRoutes = ['/']
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname)
    const { darkMode } = useSelector((state) => state.theme);
    return (
        <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
            <div className="root">
                <div className="root__left">
                    {!shouldHideLayout && <Sidebar />}
                </div>
                <div className="root__right">
                    {!shouldHideLayout && <Header />}
                    <Outlet />
                    {!shouldHideLayout && <Footer />}
                </div>
            </div>
        </div>
    )
}
export default Root
