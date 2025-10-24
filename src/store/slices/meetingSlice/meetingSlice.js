import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from "@reduxjs/toolkit";
import * as meetingService from "../../../services/meetingService";

const meetingsAdapter = createEntityAdapter({
    selectId: (meeting) => meeting.id,
    sortComparer: (a, b) =>
        (a.start_time || "").localeCompare(b.start_time || ""),
});

const initialState = meetingsAdapter.getInitialState({
    status: "idle",
    error: null,
    selectedId: null,
});

export const fetchMeetings = createAsyncThunk(
    "meetings/fetchAll",
    async ({ token } = {}, { rejectWithValue }) => {
        try {
            const res = await meetingService.getMeetings();
            return res.data;
        } catch (err) {
            console.error("Meetings fetch error:", err);
            return rejectWithValue(
                err.response?.data?.message || "Meeting-ləri yükləmək mümkün olmadı"
            );
        }
    }
);

export const fetchMeetingById = createAsyncThunk(
    "meetings/fetchById",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            const res = await meetingService.getMeetingById(id, token);
            return res.data.data; // ✅ yalnız meeting obyekti
        } catch (err) {
            return rejectWithValue(err.response?.data || "Meeting tapılmadı");
        }
    }
);

export const createMeeting = createAsyncThunk(
    "meetings/create",
    async ({ formData, token }, { rejectWithValue }) => {
        try {
            const res = await meetingService.createMeeting(formData, token);
            return res.data;
        } catch (err) {
            console.error("Meeting yaratmaqda xəta:", err);
            return rejectWithValue(
                err.response?.data?.message || "Meeting yaratmaq mümkün olmadı"
            );
        }
    }
);

export const updateMeeting = createAsyncThunk(
    "meetings/update",
    async ({ id, formData, token }, { rejectWithValue }) => {
        try {
            // Laravel PUT emulyasiyası üçün
            formData.append("_method", "PUT");

            const res = await meetingService.updateMeeting(id, formData, token);

            // Backend-də "data" içində gəlir
            return res.data.data;
        } catch (err) {
            console.error("❌ Meeting update error:", err.response?.data);

            return rejectWithValue(
                err.response?.data?.message || "Meeting yenilənmədi"
            );
        }
    }
);


export const deleteMeeting = createAsyncThunk(
    "meetings/delete",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            await meetingService.deleteMeeting(id, token);
            return id;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Meeting silinmədi"
            );
        }
    }
);
const meetingSlice = createSlice({
    name: "meetings",
    initialState,
    reducers: {
        setSelectedMeeting: (state, action) => {
            state.selectedId = action.payload;
        },
        upsertLiveMeetings: (state, action) => {
            Array.isArray(action.payload)
                ? meetingsAdapter.upsertMany(state, action.payload)
                : meetingsAdapter.upsertOne(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeetings.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchMeetings.fulfilled, (state, action) => {
                state.status = "succeeded";
                meetingsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchMeetings.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(fetchMeetingById.fulfilled, (state, action) => {
                meetingsAdapter.upsertOne(state, action.payload);
            })

            .addCase(createMeeting.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createMeeting.fulfilled, (state, action) => {
                state.status = "succeeded";
                meetingsAdapter.addOne(state, action.payload);
            })
            .addCase(createMeeting.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(updateMeeting.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateMeeting.fulfilled, (state, action) => {
                state.status = "succeeded";
                meetingsAdapter.upsertOne(state, action.payload);
            })
            .addCase(updateMeeting.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(deleteMeeting.fulfilled, (state, action) => {
                meetingsAdapter.removeOne(state, action.payload);
            });
    },
});

export const { setSelectedMeeting, upsertLiveMeetings } = meetingSlice.actions;
export default meetingSlice.reducer;
const baseSelector = (state) => state.meetings;
export const {
    selectAll: selectAllMeetings,
    selectById: selectMeetingById,
    selectIds: selectMeetingIds,
} = meetingsAdapter.getSelectors(baseSelector);
export const selectMeetingsStatus = createSelector(
    baseSelector,
    (state) => state.status
);
export const selectMeetingsError = createSelector(
    baseSelector,
    (state) => state.error
);
export const selectSelectedMeetingId = createSelector(
    baseSelector,
    (state) => state.selectedId
);
