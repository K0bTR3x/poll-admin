import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../../services/authService";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await authService.loginUser(email, password);
            const { token, user } = res.data;

            if (!token) throw new Error("Token cavabda yoxdur!");

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            return { token, user };
        } catch (err) {
            console.error("Login xətası:", err);
            return rejectWithValue(err.response?.data || "Daxil olmaq mümkün olmadı");
        }
    }
);

const initialState = {
    token: localStorage.getItem("token") || null,
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearToken: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearToken } = authSlice.actions;
export default authSlice.reducer;
