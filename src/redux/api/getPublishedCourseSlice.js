// src/redux/api/getPublishedCoursesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching published courses
export const getPublishedCourses = createAsyncThunk(
  "getPublishedCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/courses/getAllCourses`, {
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

const getPublishedCoursesSlice = createSlice({
  name: "getPublishedCourses",
  initialState: {
    loading: false,
    error: null,
    success: null,
    status: null,
    publishedCourses: [],
  },
  reducers: {
    clearPublishedCoursesState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.status = null;
      state.publishedCourses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPublishedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null;
      })
      .addCase(getPublishedCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Published courses fetched successfully!";
        state.status = action.payload.status;
        state.publishedCourses = action.payload.data; // Store published courses data on success
      })
      .addCase(getPublishedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { clearPublishedCoursesState } = getPublishedCoursesSlice.actions;
export default getPublishedCoursesSlice.reducer;
