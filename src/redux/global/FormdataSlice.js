// src/redux/slices/FormDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userCreds: []
};

export const FormDataSlice = createSlice({
  name: 'userCreds',
  initialState,
  reducers: {
    setUserCredsData(state, action) {
      state.userCreds = action.payload
    },
    clearUserCredsData(state) {
      state.userCreds = []
    }
  }
});

export const { setUserCredsData, clearUserCredsData } = FormDataSlice.actions;

export default FormDataSlice.reducer;
