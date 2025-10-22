import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Gələcəkdə voteService əlavə edəcəksən
// import * as voteService from "@/services/voteService";

const initialState = {
    // eventId -> { optionId -> count, total }
    tallies: {},
    status: "idle",
    error: null,
};

export const submitVote = createAsyncThunk(
    "votes/submit",
    async ({ eventId, optionId }, { rejectWithValue }) => {
        try {
            // const res = await voteService.sendVote(eventId, optionId);
            // return res.data; // { eventId, tallies: {...} }
            return { eventId, optionId }; // mock
        } catch (err) {
            return rejectWithValue(err.response?.data || "Səs göndərilmədi");
        }
    }
);

const voteSlice = createSlice({
    name: "votes",
    initialState,
    reducers: {
        // socket-dən gələn real-time paket
        mergeLiveTally: (state, action) => {
            const { eventId, tallies } = action.payload;
            state.tallies[eventId] = { ...(state.tallies[eventId] || {}), ...tallies };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitVote.pending, (state) => {
                state.status = "loading";
            })
            .addCase(submitVote.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { eventId, optionId } = action.payload;
                const current = state.tallies[eventId] || {};
                const next = { ...current };
                next[optionId] = (next[optionId] || 0) + 1;
                next.total = (next.total || 0) + 1;
                state.tallies[eventId] = next;
            })
            .addCase(submitVote.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { mergeLiveTally } = voteSlice.actions;
export default voteSlice.reducer;

// Selectors
export const selectEventTally = (eventId) => (state) => state.votes.tallies[eventId] || {};
export const selectVotesStatus = (state) => state.votes.status;
export const selectVotesError = (state) => state.votes.error;
