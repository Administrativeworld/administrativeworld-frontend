import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch enrolled courses
export const fetchEnrolledCourses = createAsyncThunk(
  "courses/getEnrolledCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/profile/getEnrolledCourses`, {}, {
        withCredentials: true, // Ensures cookies (like auth tokens) are sent
      });
      return response.data.courses; // Assuming the API returns { success: true, courses: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch courses");
    }
  }
);

const getEnrolledCoursesSlice = createSlice({
  name: "enrolledCourses",
  initialState: {
    enrolledCourses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearEnrolledCourses: (state) => {
      state.enrolledCourses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEnrolledCourses } = getEnrolledCoursesSlice.actions;
export default getEnrolledCoursesSlice.reducer;
