import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setSection, setSectionId } from "./courseBuilderSlice";

export const createSection = createAsyncThunk(
  "createSection",
  async (sectionData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/courses/addSection`, sectionData, {
        withCredentials: true,
      });
      dispatch(setSection(response.data.newSection))
      dispatch(setSectionId(response.data.newSection._id))
      return { data: response.data, status: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "An error occurred. Please try again.",
        status: error.response?.status || 500 // Include status code
      });
    }
  }
);

const createSectionSlice = createSlice({
  name: "createSection",
  initialState: {
    loading: false,
    error: null,
    success: null,
    status: null,
    Data: null,
  },
  reducers: {
    clearSectionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.status = null;
      state.Data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "success";
        state.status = action.payload.status;
        state.user = action.payload.data; // Store user data on success
      })
      .addCase(createSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { clearSectionState } = createSectionSlice.actions;
export default createSectionSlice.reducer;