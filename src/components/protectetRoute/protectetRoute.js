import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
    const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");

    // Əgər token yoxdursa, login səhifəsinə yönləndir
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Token varsa, səhifəni göstər
    return <Outlet />;
};

export default ProtectedRoute;
