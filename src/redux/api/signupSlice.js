import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for user registration
export const signup = createAsyncThunk(
  "signup",
  async (userCreds, { rejectWithValue }) => {
    try {
      const response = await axios.post(import.meta.env.VITE_SIGNUP, userCreds, {
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

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    loading: false,
    error: null,
    success: null, // Optional field for success messages
    status: null,
  },
  reducers: {
    clearSignupState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.status = null; // Clear status state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null; // Reset status on pending
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Registration successful!";
        state.status = action.payload.status; // Capture success status code
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // Holds error message
        state.status = action.payload.status; // Capture error status code
      });
  },
});

export const { clearSignupState } = signupSlice.actions;
export default signupSlice.reducer;
