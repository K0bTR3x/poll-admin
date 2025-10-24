import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from "@reduxjs/toolkit";
import * as meetingservice from "../../../services/meetingService";

// 1) Adapter
const meetingsAdapter = createEntityAdapter({
    selectId: (e) => e.id,
    // start_time stringdirsə lexicographic sıralama da iş görür
    sortComparer: (a, b) => (a.start_time || "").localeCompare(b.start_time || ""),
});

// 2) State
const initialState = meetingsAdapter.getInitialState({
    status: "idle",     // idle | loading | succeeded | failed
    error: null,
    selectedId: null,   // UI üçün seçilmiş event
});

// 3) Thunk-lar
export const fetchMeetings = createAsyncThunk(
    "meetings/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await meetingservice.getMeetings();
            return res.data; // Array
        } catch (err) {
            return rejectWithValue(err.response?.data || "Eventləri çəkmək alınmadı");
        }
    }
);

export const fetchMeetingById = createAsyncThunk(
    "meetings/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await meetingservice.getMeetingById(id);
            return res.data; // Object
        } catch (err) {
            return rejectWithValue(err.response?.data || "Event tapılmadı");
        }
    }
);

export const createMeeting = createAsyncThunk(
    "meetings/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await meetingservice.createMeeting(data);
            return res.data; // created object
        } catch (err) {
            return rejectWithValue(err.response?.data || "Event yaratmaq mümkün olmadı");
        }
    }
);

export const updateMeeting = createAsyncThunk(
    "meetings/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await meetingservice.updateMeeting(id, data);
            return res.data; // updated object
        } catch (err) {
            return rejectWithValue(err.response?.data || "Event yenilənmədi");
        }
    }
);

export const deleteMeeting = createAsyncThunk(
    "meetings/delete",
    async (id, { rejectWithValue }) => {
        try {
            await meetingservice.deleteMeeting(id);
            return id; // remove by id
        } catch (err) {
            return rejectWithValue(err.response?.data || "Event silinmədi");
        }
    }
);

// 4) Slice
const meetingSlice = createSlice({
    name: "meetings",
    initialState,
    reducers: {
        setSelectedEvent: (state, action) => {
            state.selectedId = action.payload;
        },
        // Socket-dən gələn canlı yeniləmələr üçün hazır action-lar
        upsertLivemeetings: (state, action) => {
            // payload: array | object
            Array.isArray(action.payload)
                ? meetingsAdapter.upsertMany(state, action.payload)
                : meetingsAdapter.upsertOne(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchAll
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
            // fetchById
            .addCase(fetchMeetingById.fulfilled, (state, action) => {
                meetingsAdapter.upsertOne(state, action.payload);
            })
            // create
            .addCase(createMeeting.fulfilled, (state, action) => {
                meetingsAdapter.addOne(state, action.payload);
            })
            // update
            .addCase(updateMeeting.fulfilled, (state, action) => {
                meetingsAdapter.upsertOne(state, action.payload);
            })
            // delete
            .addCase(deleteMeeting.fulfilled, (state, action) => {
                meetingsAdapter.removeOne(state, action.payload);
            });
    },
});

export const { setSelectedEvent, upsertLivemeetings } = meetingSlice.actions;
export default meetingSlice.reducer;

// 5) Selector-lar
const baseSelector = (state) => state.meetings;
export const {
    selectAll: selectAllMeetings,
    selectById: selectMeetingById,
    selectIds: selectMeetingIds,
} = meetingsAdapter.getSelectors(baseSelector);

export const selectMeetingsStatus = createSelector(baseSelector, (s) => s.status);
export const selectMeetingsError = createSelector(baseSelector, (s) => s.error);
export const selectSelectedMeetingId = createSelector(baseSelector, (s) => s.selectedId);
