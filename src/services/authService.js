// src/services/authService.js
import api from "./api";

export const loginUser = async (email, password) => {
    console.log("🔹 API POST body:", { email, password });
    const res = await api.post("/login", { email, password });
    console.log("🔹 API RESPONSE:", res);
    return res;
};

export const getCurrentUser = () => api.get("/me");
