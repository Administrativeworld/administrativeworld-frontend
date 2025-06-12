import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const validateUser = createAsyncThunk(
  'auth/validateUser',
  async (_, { rejectWithValue }) => {
    try {
      // Add a small delay for initial load to ensure cookies are ready
      if (document.readyState !== 'complete') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/validate`, {}, { withCredentials: true });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Validation failed' });
    }
  }
);

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  loggedIn: false,
};

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.loggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(validateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.loggedIn = true;
      })
      .addCase(validateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loggedIn = false;
      });
  },
});

export const { logout } = authUserSlice.actions;
export default authUserSlice.reducer;
