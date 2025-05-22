// src/redux/api/loginSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for user login
export const login = createAsyncThunk(
  "login",
  async (userCreds, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, userCreds, {
        withCredentials: true,
      });
      return { data: response.data, status: response.status }; // Return relevant success data along with status code
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "An error occurred. Please try again.",
        status: error.response?.status || 500 // Include status code
      });
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loading: false,
    error: null,
    success: null,
    status: null,
    user: null, // Optional field to store user data
  },
  reducers: {
    clearLoginState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.status = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Login successful!";
        state.status = action.payload.status;
        state.user = action.payload.data; // Store user data on success
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { clearLoginState } = loginSlice.actions;
export default loginSlice.reducer;
