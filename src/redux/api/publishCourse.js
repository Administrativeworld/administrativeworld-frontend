import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for publishing a course
export const publishCourse = createAsyncThunk(
  "publishCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/publishCourse`,
        { courseId },
        { withCredentials: true }
      );
      return { data: response.data, status: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "An error occurred. Please try again.",
        status: error.response?.status || 500, // Include status code
      });
    }
  }
);

const publishCourseSlice = createSlice({
  name: "publishCourse",
  initialState: {
    loading: false,
    error: null,
    success: null,
    status: null,
    data: null,
  },
  reducers: {
    clearPublishState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.status = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null;
      })
      .addCase(publishCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "success";
        state.status = action.payload.status;
        state.data = action.payload.data; // Store updated course data on success
      })
      .addCase(publishCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { clearPublishState } = publishCourseSlice.actions;
export default publishCourseSlice.reducer;
