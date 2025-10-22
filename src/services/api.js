import axios from "axios";
import { clearToken } from "../store/slices/authSlice/AuthSlice";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

// ✅ Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // yalnız localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token etibarsızdır
            localStorage.removeItem("token");
            // Redux-a girmədən, sadəcə redirect
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;
