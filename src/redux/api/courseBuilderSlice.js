import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 0,
  courseId: null,
  sectionId: null,
  subSection: [],
  sections: [],
};

const courseBuilderSlice = createSlice({
  name: "courseBuilder",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.step < 2) state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 0) state.step -= 1;
    },
    setCreationStep(state, action) {
      state.step = action.payload;
    },
    setCourseBuilderId(state, action) {
      state.courseId = action.payload;
    },
    setSectionId(state, action) {
      state.sectionId = action.payload;
    },
    setSubSection: (state, action) => {
      // Remove any existing matching data
      state.subSection = state.subSection.filter(
        (subItem) => subItem._id !== action.payload._id
      );

      // Add the new data
      state.subSection.push({ ...action.payload });
    },
    setSection: (state, action) => {
      const newValue = `item-${state.sections.length + 1}`;
      state.sections.push({ ...action.payload, value: newValue });
    }
  },
});

export const { nextStep, prevStep, setCreationStep, setCourseBuilderId, setSection, setSectionId, setSubSection } = courseBuilderSlice.actions;
export default courseBuilderSlice.reducer;
