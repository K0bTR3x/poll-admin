import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from "@reduxjs/toolkit";
import * as eventService from "../../../services/eventService";

// 1) Adapter
const eventsAdapter = createEntityAdapter({
    selectId: (e) => e.id,
    // start_time stringdirsə lexicographic sıralama da iş görür
    sortComparer: (a, b) => (a.start_time || "").localeCompare(b.start_time || ""),
});

// 2) State
const initialState = eventsAdapter.getInitialState({
    status: "idle",     // idle | loading | succeeded | failed
    error: null,
    selectedId: null,   // UI üçün seçilmiş event
});

// 3) Thunk-lar
export const fetchEvents = createAsyncThunk(
    "events/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await eventService.getEvents();
            return res.data; // Array
        } catch (err) {
            return rejectWithValue(err.response?.data || "Eventləri çəkmək alınmadı");
        }
    }
);

export const fetchEventById = createAsyncThunk(
    "events/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await eventService.getEventById(id);
            return res.data; // Object
        } catch (err) {
            return rejectWithValue(err.response?.data || "Event tapılmadı");
        }
    }
);

export const createEvent = createAsyncThunk(
    "events/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await eventService.createEvent(data);
            return res.data; // created object
        } catch (err) {
            return rejectWithValue(err.response?.data || "Event yaratmaq mümkün olmadı");
        }
    }
);

export const updateEvent = createAsyncThunk(
    "events/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await eventService.updateEvent(id, data);
            return res.data; // updated object
        } catch (err) {
            return rejectWithValue(err.response?.data || "Event yenilənmədi");
        }
    }
);

export const deleteEvent = createAsyncThunk(
    "events/delete",
    async (id, { rejectWithValue }) => {
        try {
            await eventService.deleteEvent(id);
            return id; // remove by id
        } catch (err) {
            return rejectWithValue(err.response?.data || "Event silinmədi");
        }
    }
);

// 4) Slice
const eventSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        setSelectedEvent: (state, action) => {
            state.selectedId = action.payload;
        },
        // Socket-dən gələn canlı yeniləmələr üçün hazır action-lar
        upsertLiveEvents: (state, action) => {
            // payload: array | object
            Array.isArray(action.payload)
                ? eventsAdapter.upsertMany(state, action.payload)
                : eventsAdapter.upsertOne(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchAll
            .addCase(fetchEvents.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = "succeeded";
                eventsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // fetchById
            .addCase(fetchEventById.fulfilled, (state, action) => {
                eventsAdapter.upsertOne(state, action.payload);
            })
            // create
            .addCase(createEvent.fulfilled, (state, action) => {
                eventsAdapter.addOne(state, action.payload);
            })
            // update
            .addCase(updateEvent.fulfilled, (state, action) => {
                eventsAdapter.upsertOne(state, action.payload);
            })
            // delete
            .addCase(deleteEvent.fulfilled, (state, action) => {
                eventsAdapter.removeOne(state, action.payload);
            });
    },
});

export const { setSelectedEvent, upsertLiveEvents } = eventSlice.actions;
export default eventSlice.reducer;

// 5) Selector-lar
const baseSelector = (state) => state.events;
export const {
    selectAll: selectAllEvents,
    selectById: selectEventById,
    selectIds: selectEventIds,
} = eventsAdapter.getSelectors(baseSelector);

export const selectEventsStatus = createSelector(baseSelector, (s) => s.status);
export const selectEventsError = createSelector(baseSelector, (s) => s.error);
export const selectSelectedEventId = createSelector(baseSelector, (s) => s.selectedId);
