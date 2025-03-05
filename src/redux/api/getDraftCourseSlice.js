// src/redux/api/getDraftCoursesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching drafted courses
export const getDraftCourses = createAsyncThunk(
  "getDraftCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses/courseCreationDraft`, {
        withCredentials: true,
      });
      return { data: response.data, status: response.status }; // Return relevant success data along with status code
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "An error occurred. Please try again.",
        status: error.response?.status || 500, // Include status code
      });
    }
  }
);

const getDraftCoursesSlice = createSlice({
  name: "getDraftCourses",
  initialState: {
    loading: false,
    error: null,
    success: null,
    status: null,
    draftCourses: [],
  },
  reducers: {
    clearDraftCoursesState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.status = null;
      state.draftCourses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDraftCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null;
      })
      .addCase(getDraftCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Draft courses fetched successfully!";
        state.status = action.payload.status;
        state.draftCourses = action.payload.data; // Store draft courses data on success
      })
      .addCase(getDraftCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { clearDraftCoursesState } = getDraftCoursesSlice.actions;
export default getDraftCoursesSlice.reducer;
