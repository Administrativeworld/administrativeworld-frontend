// combosSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

// AsyncThunk to fetch all book combos
export const fetchBookCombos = createAsyncThunk(
  "combos/fetchBookCombos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/store/getBookCombos`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        return response.data.data;
      } else {
        toast.error("Failed to fetch combos");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      console.error("Fetch combos error:", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching combos");
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

// Combos Slice
const combosSlice = createSlice({
  name: "combos",
  initialState: {
    combos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookCombos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookCombos.fulfilled, (state, action) => {
        state.loading = false;
        state.combos = action.payload;
      })
      .addCase(fetchBookCombos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default combosSlice.reducer;
