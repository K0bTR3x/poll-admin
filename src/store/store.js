import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice/themeSlice";
import authReducer from "./slices/authSlice/AuthSlice";
import meetingReducer from "./slices/meetingSlice/meetingSlice";
import questionReducer from "./slices/questionSlice/questionSlice";

// API xətalarını və ya token müddəti bitəndə avtomatik çıxışı idarə edən middleware
const apiErrorMiddleware = (store) => (next) => (action) => {
    if (action?.type?.endsWith("/rejected")) {
        const status = action?.payload?.status || action?.payload?.code;
        if (status === 401) {
            // Token etibarsızdır — auth-u sıfırlaya bilərik
            console.warn("401 Unauthorized - token sıfırlanır...");
            store.dispatch({ type: "auth/clearToken" });
        }
    }
    return next(action);
};

const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        meetings: meetingReducer, // yeni slice əlavə etdik
        questions:questionReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // RTK üçün təhlükəsizdir
        }).concat(apiErrorMiddleware),
    devTools: process.env.NODE_ENV !== "production", // yalnız dev modda aktiv
});

export default store;
