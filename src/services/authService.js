// src/services/authService.js
import api from "./api";

export const loginUser = async (email, password) => {
    const res = await api.post("/login", { email, password });
    return res;
};

export const getCurrentUser = () => api.get("/profile");
