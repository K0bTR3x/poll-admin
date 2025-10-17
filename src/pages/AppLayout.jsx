import React, { useState, useEffect } from "react";
import { Layout } from "antd"; // <- buradan Layout
import { Outlet, useLocation } from "react-router-dom"; // router funksiyaları
import { useSelector } from "react-redux";
import HeaderBar from "../layout/header/Header";
import FooterBar from "../layout/footer/Footer";
import "./AppLayout.scss";

const { Content } = Layout;

const AppLayout = () => {
    const location = useLocation();
    const { darkMode } = useSelector((state) => state.theme);
    const hideLayoutRoutes = ["/"];
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

    return (
        <Layout className={`dashboard app-layout ${darkMode ? "dark" : "light"}`}>
            {!shouldHideLayout && <HeaderBar />}
            <Content className="app-content">
                <Outlet />
            </Content>
            {!shouldHideLayout && <FooterBar />}
        </Layout>
    );
};

export default AppLayout;
