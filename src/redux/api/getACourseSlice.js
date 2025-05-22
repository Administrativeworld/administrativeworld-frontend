import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching a course by ID
export const getACourse = createAsyncThunk(
  "course/getACourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/courses/getACourse`, { courseId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const getACourseSlice = createSlice({
  name: "getACourse",
  initialState: {
    course: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getACourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getACourse.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
      })
      .addCase(getACourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getACourseSlice.reducer;
