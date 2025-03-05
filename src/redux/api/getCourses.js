import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/courses/getAllCourses`;

// Async thunk to fetch paginated and filtered courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async ({ page = 1, limit = 10, categoryIds = [] }, { rejectWithValue }) => {
    try {
      const requestData = { page, limit };

      // Add categoryIds only if the array is not empty
      if (categoryIds.length > 0) {
        requestData.categoryIds = categoryIds;
      }

      const response = await axios.post(API_URL, requestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch courses");
    }
  }
);

const getCoursesSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    totalPages: 1,
    currentPage: 1,
    totalCourses: 0,
    selectedCategories: [], // Stores selected category filters
    loading: false,
    error: null,
  },
  reducers: {
    clearCourses: (state) => {
      state.courses = [];
      state.totalPages = 1;
      state.currentPage = 1;
      state.totalCourses = 0;
      state.selectedCategories = [];
      state.loading = false;
      state.error = null;
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalCourses = action.payload.totalCourses;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCourses, setSelectedCategories } = getCoursesSlice.actions;
export default getCoursesSlice.reducer;
