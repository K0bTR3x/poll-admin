import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import * as questionService from "../../../services/questionService";

const questionsAdapter = createEntityAdapter({
    selectId: (question) => question.id,
    sortComparer: (a, b) => b.id - a.id,
});

const initialState = questionsAdapter.getInitialState({
    status: "idle",
    error: null,
});

// 🔹 Sualları çək
export const fetchQuestions = createAsyncThunk(
    "questions/fetchAll",
    async ({ meetingId }, { rejectWithValue }) => {
        try {
            const res = await questionService.getQuestionsByMeeting(meetingId);
            return res.data.data; // backenddən gələn data
        } catch (err) {
            return rejectWithValue("Suallar yüklənmədi");
        }
    }
);

// 🔹 Sual yarat
export const createQuestion = createAsyncThunk(
    "questions/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await questionService.createQuestion(data);
            return res.data.data;
        } catch (err) {
            return rejectWithValue("Sual əlavə edilə bilmədi");
        }
    }
);

// 🔹 Sual sil
export const deleteQuestion = createAsyncThunk(
    "questions/delete",
    async (id, { rejectWithValue }) => {
        try {
            await questionService.deleteQuestion(id);
            return id;
        } catch (err) {
            return rejectWithValue("Sual silinmədi");
        }
    }
);

const questionSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.status = "succeeded";
                questionsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                questionsAdapter.addOne(state, action.payload);
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                questionsAdapter.removeOne(state, action.payload);
            });
    },
});

export default questionSlice.reducer;

const baseSelector = (state) => state.questions;

export const {
    selectAll: selectAllQuestions,
    selectById: selectQuestionById,
} = questionsAdapter.getSelectors(baseSelector);

export const selectQuestionsByMeetingId = createSelector(
    [selectAllQuestions, (_, meetingId) => meetingId],
    (questions, meetingId) => questions.filter((q) => q.meeting_id === meetingId)
);

export const selectQuestionsStatus = createSelector(
    baseSelector,
    (state) => state.status
);
