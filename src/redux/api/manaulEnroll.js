import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for manually enrolling a student
export const manualEnrollStudent = createAsyncThunk(
  "manualEnrollStudent/enroll",
  async ({ courseId, email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payment/manualEnrollStudent`,
        { courseId, email },
        { withCredentials: true }
      );

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status ?? "Unknown",
        message:
          error.response?.data?.message ?? "An error occurred during enrollment",
      });
    }
  }
);

// Slice for handling manual enrollment state
const manualEnrollStudentSlice = createSlice({
  name: "manualEnrollStudent",
  initialState: {
    loading: false,
    success: null,
    error: null,
    status: null,
    student: null,
  },
  reducers: {
    clearEnrollState: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
      state.status = null;
      state.student = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(manualEnrollStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null;
      })
      .addCase(manualEnrollStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Student enrolled successfully!";
        state.status = action.payload.status;
        state.student = action.payload.data;
      })
      .addCase(manualEnrollStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Unknown error";
        state.status = action.payload?.status ?? "Unknown";
      });
  },
});

export const { clearEnrollState } = manualEnrollStudentSlice.actions;
export default manualEnrollStudentSlice.reducer;
