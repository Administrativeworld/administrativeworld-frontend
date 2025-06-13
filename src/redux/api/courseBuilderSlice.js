import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks for fetching existing course data
export const fetchSections = createAsyncThunk(
  'courseBuilder/fetchSections',
  async (courseId, { rejectWithValue }) => {
    try {
      // Updated to match your API endpoint
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/courses/fetchSections?courseId=${courseId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({})
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubSections = createAsyncThunk(
  'courseBuilder/fetchSubSections',
  async (sectionId, { rejectWithValue }) => {
    try {
      // Updated to match your API pattern
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/courses/fetchSubSections?sectionId=${sectionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({})
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch subsections');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  step: 0,
  courseId: null,
  sectionId: null,
  subSection: [],
  sections: [],
  // New fields for edit mode
  isEditMode: false,
  originalCourseData: null,
  loading: {
    sections: false,
    subSections: false,
  },
  error: {
    sections: null,
    subSections: null,
  }
};

const courseBuilderSlice = createSlice({
  name: "courseBuilder",
  initialState,
  reducers: {
    // Existing navigation reducers
    nextStep: (state) => {
      if (state.step < 2) state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 0) state.step -= 1;
    },
    setCreationStep(state, action) {
      state.step = action.payload;
    },

    // Existing data setters
    setCourseBuilderId(state, action) {
      state.courseId = action.payload;
    },
    setSectionId(state, action) {
      state.sectionId = action.payload;
    },

    // Enhanced setSubSection with better handling
    setSubSection: (state, action) => {
      // Remove any existing matching data
      state.subSection = state.subSection.filter(
        (subItem) => subItem._id !== action.payload._id
      );

      // Add the new data
      state.subSection.push({ ...action.payload });
    },

    // Enhanced setSection with better handling for edit mode
    setSection: (state, action) => {
      if (state.isEditMode && action.payload._id) {
        // In edit mode, update existing section if it has an ID
        const existingIndex = state.sections.findIndex(
          section => section._id === action.payload._id
        );

        if (existingIndex !== -1) {
          state.sections[existingIndex] = { ...action.payload };
        } else {
          // Add new section even in edit mode
          const newValue = `item-${state.sections.length + 1}`;
          state.sections.push({ ...action.payload, value: newValue });
        }
      } else {
        // Original creation logic
        const newValue = `item-${state.sections.length + 1}`;
        state.sections.push({ ...action.payload, value: newValue });
      }
    },

    // New reducers for edit mode
    enableEditMode: (state, action) => {
      state.isEditMode = true;
      state.courseId = action.payload.courseId;
      state.originalCourseData = action.payload.courseData;
      // Set initial step for edit mode (you can customize this)
      state.step = action.payload.initialStep || 0;
    },

    disableEditMode: (state) => {
      state.isEditMode = false;
      state.originalCourseData = null;
    },

    // Reset to initial state (useful when switching between create/edit)
    resetCourseBuilder: (state) => {
      Object.assign(state, initialState);
    },

    // Bulk update sections (useful when fetching all sections at once)
    setSections: (state, action) => {
      state.sections = action.payload.map((section, index) => ({
        ...section,
        value: section.value || `item-${index + 1}`
      }));
    },

    // Bulk update subsections
    setSubSections: (state, action) => {
      state.subSection = action.payload;
    },

    // Update existing section
    updateSection: (state, action) => {
      const index = state.sections.findIndex(
        section => section._id === action.payload._id
      );
      if (index !== -1) {
        state.sections[index] = { ...state.sections[index], ...action.payload };
      }
    },

    // Remove section
    removeSection: (state, action) => {
      state.sections = state.sections.filter(
        section => section._id !== action.payload
      );
    },

    // Remove subsection
    removeSubSection: (state, action) => {
      state.subSection = state.subSection.filter(
        subSection => subSection._id !== action.payload
      );
    },

    // NEW: Add subsection to a specific section
    addSubSectionToSection: (state, action) => {
      const { sectionId, subSectionData } = action.payload;

      // Find the section and add the subsection
      const sectionIndex = state.sections.findIndex(
        section => section._id === sectionId
      );

      if (sectionIndex !== -1) {
        if (!state.sections[sectionIndex].subSection) {
          state.sections[sectionIndex].subSection = [];
        }
        state.sections[sectionIndex].subSection.push(subSectionData);
      }
    },

    // NEW: Update subsection in a specific section
    updateSubSectionInSection: (state, action) => {
      const { sectionId, subSectionId, subSectionData } = action.payload;

      // Find the section
      const sectionIndex = state.sections.findIndex(
        section => section._id === sectionId
      );

      if (sectionIndex !== -1 && state.sections[sectionIndex].subSection) {
        // Find and update the subsection
        const subSectionIndex = state.sections[sectionIndex].subSection.findIndex(
          subSection => subSection._id === subSectionId
        );

        if (subSectionIndex !== -1) {
          state.sections[sectionIndex].subSection[subSectionIndex] = {
            ...state.sections[sectionIndex].subSection[subSectionIndex],
            ...subSectionData
          };
        }
      }
    },

    // NEW: Remove subsection from a specific section
    removeSubSectionFromSection: (state, action) => {
      const { sectionId, subSectionId } = action.payload;

      // Find the section
      const sectionIndex = state.sections.findIndex(
        section => section._id === sectionId
      );

      if (sectionIndex !== -1 && state.sections[sectionIndex].subSection) {
        // Remove the subsection
        state.sections[sectionIndex].subSection = state.sections[sectionIndex].subSection.filter(
          subSection => subSection._id !== subSectionId
        );
      }
    },

    // Clear errors
    clearErrors: (state) => {
      state.error.sections = null;
      state.error.subSections = null;
    }
  },

  // Handle async thunk states
  extraReducers: (builder) => {
    builder
      // fetchSections cases
      .addCase(fetchSections.pending, (state) => {
        state.loading.sections = true;
        state.error.sections = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading.sections = false;
        state.sections = action.payload.map((section, index) => ({
          ...section,
          value: section.value || `item-${index + 1}`
        }));
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading.sections = false;
        state.error.sections = action.payload;
      })

      // fetchSubSections cases
      .addCase(fetchSubSections.pending, (state) => {
        state.loading.subSections = true;
        state.error.subSections = null;
      })
      .addCase(fetchSubSections.fulfilled, (state, action) => {
        state.loading.subSections = false;
        state.subSection = action.payload;
      })
      .addCase(fetchSubSections.rejected, (state, action) => {
        state.loading.subSections = false;
        state.error.subSections = action.payload;
      });
  }
});

export const {
  // Existing actions
  nextStep,
  prevStep,
  setCreationStep,
  setCourseBuilderId,
  setSection,
  setSectionId,
  setSubSection,

  // New actions
  enableEditMode,
  disableEditMode,
  resetCourseBuilder,
  setSections,
  setSubSections,
  updateSection,
  removeSection,
  removeSubSection,
  clearErrors,

  // NEW: Subsection management actions
  addSubSectionToSection,
  updateSubSectionInSection,
  removeSubSectionFromSection
} = courseBuilderSlice.actions;

export default courseBuilderSlice.reducer;