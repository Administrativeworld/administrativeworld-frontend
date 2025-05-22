// src/redux/api/getCategorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching categories
export const getCategory = createAsyncThunk(
  "getCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses/showAllCategories`, {
        withCredentials: true,
      });
      return { data: response.data.data, status: response.status }; // Return relevant success data along with status code
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "An error occurred. Please try again.",
        status: error.response?.status || 500 // Include status code
      });
    }
  }
);

const getCategorySlice = createSlice({
  name: "getCategory",
  initialState: {
    loading: false,
    error: null,
    success: null,
    status: null,
    categories: [], // Field to store categories data
  },
  reducers: {
    clearCategoryState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.status = null;
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Categories fetched successfully!";
        state.status = action.payload.status;
        state.categories = action.payload.data; // Store categories data on success
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { clearCategoryState } = getCategorySlice.actions;
export default getCategorySlice.reducer;
