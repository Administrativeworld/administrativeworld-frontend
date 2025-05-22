import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { validateUser } from "./authUserSlice";


// Utility function to filter out empty values
const filterUserData = (data) => {
  return Object.fromEntries(
    // eslint-disable-next-line no-unused-vars
    Object.entries(data).filter(([_, value]) => value !== "")
  );
};

// Async thunk to update profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const filteredData = filterUserData(userData);

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/profile/updateProfile`,
        filteredData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Dispatch validateUser after successful update
      if (response.status === 200) {
        dispatch(validateUser());
      }

      return { data: response.data, status: response.status };
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data || "Failed to update profile",
        status: error.response?.status || 500,
      });
    }
  }
);

const updateProfileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null, // Will hold user data
    loading: false,
    error: null,
    success: false,
    status: null, // Stores the HTTP status code
  },
  reducers: {
    setProfileData: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.status = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data; // Updated user data
        state.status = action.payload.status; // HTTP status code
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload.error;
        state.status = action.payload.status;
      });
  },
});

export const { setProfileData, resetProfileState } = updateProfileSlice.actions;
export default updateProfileSlice.reducer;
