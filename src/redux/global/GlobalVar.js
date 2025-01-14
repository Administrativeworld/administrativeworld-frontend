// src/redux/slices/FormDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  otpInput: false
};

export const GlobalVarSlice = createSlice({
  name: 'userCreds',
  initialState,
  reducers: {
    setOtpInput(state, action) {
      state.otpInput = action.payload
    },

  }
});

export const { setOtpInput } = GlobalVarSlice.actions;

export default GlobalVarSlice.reducer;
