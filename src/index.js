// index.js
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import App from "./App";
import "./assets/styles/theme.scss";
import store from "./store/store";
import "./index.css";
// ThemeVariables komponenti: body class və CSS dəyişənləri üçün
const ThemeVariables = () => {
    const { darkMode, themeColor } = useSelector((state) => state.theme);
    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        root.style.setProperty("--color-primary", themeColor || "#1677ff");
        root.style.setProperty("--bg-main", darkMode ? "#121212" : "#f5f5f5");
        root.style.setProperty("--bg-header", darkMode ? "#1a1a2a" : themeColor || "#1677ff");
        root.style.setProperty("--bg-footer", darkMode ? "#1a1a2a" : themeColor || "#1677ff");
        root.style.setProperty("--text-main", darkMode ? "#ffffff" : "#121212");
        root.style.setProperty("--text-muted", darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)");
        root.style.setProperty("--hover-color", darkMode ? "#3273f5" : "#0056d2");
    }, [darkMode, themeColor]);

    return null;
};
const Root = () => {
    const { darkMode, themeColor } = useSelector((state) => state.theme);
    return (
        <>
            <ThemeVariables />
            <ConfigProvider
                theme={{
                    algorithm: darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                    token: {
                        colorPrimary: themeColor || "#1677ff",
                        borderRadius: 8,
                    },
                }}
            >
                <App />
            </ConfigProvider>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Root />
        </BrowserRouter>
    </Provider>
);
