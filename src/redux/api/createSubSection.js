import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setSubSection } from "./courseBuilderSlice";

export const createSubSection = createAsyncThunk(
  "createSubSection",
  async (subSectionData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/addSubSection`,
        subSectionData,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data.data)
      dispatch(setSubSection(response.data.data));

      return { data: response.data, status: response.status };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "An error occurred. Please try again.",
        status: error.response?.status || 500,
      });
    }
  }
);

const createSubSectionSlice = createSlice({
  name: "createSubSection",
  initialState: {
    loading: false,
    error: null,
    success: null,
    status: null,
    data: null,
  },
  reducers: {
    clearSubSectionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.status = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubSection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null;
      })
      .addCase(createSubSection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "success";
        state.status = action.payload.status;
        state.data = action.payload.data; // Store the new subsection data
      })
      .addCase(createSubSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { clearSubSectionState } = createSubSectionSlice.actions;
export default createSubSectionSlice.reducer;
