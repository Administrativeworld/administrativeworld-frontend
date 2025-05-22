// src/redux/slices/FormDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  otpInput: false,
  profileEditDialog: false, // New state for dialog visibility
  courseCreation: {
    creation: false,
    creationStep: null,
  },
};

export const GlobalVarSlice = createSlice({
  name: 'globalVars',
  initialState,
  reducers: {
    setOtpInput(state, action) {
      state.otpInput = action.payload;
    },
    setProfileEditDialog(state, action) {
      state.profileEditDialog = action.payload; // Reducer for managing profile edit dialog state
    },
    setCourseCreation(state, action) {
      state.courseCreation.creation = action.payload;
    },
    setCourseCreationStep(state, action) {
      state.courseCreation.creationStep = action.payload;
    },
    setCourseId(state, action) {
      state.courseId = action.payload;
    },
  },
});

export const {
  setOtpInput,
  setProfileEditDialog, // Export the action
  setCourseCreation,
  setCourseCreationStep,
  setCourseId
} = GlobalVarSlice.actions;

export default GlobalVarSlice.reducer;
