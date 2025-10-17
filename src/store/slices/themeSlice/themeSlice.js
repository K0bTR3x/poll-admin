import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
    themeColor: localStorage.getItem("themeColor") || "#1677ff", // default blue
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
            if (state.darkMode) {
                document.body.classList.add("dark");
            } else {
                document.body.classList.remove("dark");
            }
        },
        setThemeColor: (state, action) => {
            state.themeColor = action.payload;
            localStorage.setItem("themeColor", state.themeColor);
        },
    },
});

export const { toggleTheme, setThemeColor } = themeSlice.actions;
export default themeSlice.reducer;
