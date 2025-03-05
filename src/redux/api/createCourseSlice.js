// src/redux/api/createCourseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import imageCompression from "browser-image-compression";
import axios from "axios";

// Async thunk for creating a course
export const createCourse = createAsyncThunk(
  "createCourse",
  async (courseDetails, { rejectWithValue }) => {
    const {
      thumbnail,
      courseName,
      courseDescription,
      price,
      category,
      whatYouWillLearn,
      tag,
      instructions,
      couponCode,
    } = courseDetails;
    try {
      let thumbnailUrl = "";
      if (thumbnail) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedThumbnail = await imageCompression(thumbnail, options);
        const formData = new FormData();
        formData.append("file", compressedThumbnail);
        formData.append("upload_preset", "chatty_avatar_preset");

        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_CLOUDINARY_URL}`,
          formData
        );
        thumbnailUrl = uploadResponse.data.secure_url;
      }

      // Create course with the processed thumbnail URL
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/createCourse`,
        {
          courseName,
          courseDescription,
          price,
          category,
          whatYouWillLearn,
          tag,
          instructions,
          couponCode,
          thumbnail: thumbnailUrl,
        },
        { withCredentials: true }
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status ?? "Unknown error",
        message: error.response?.data?.message ?? "An error occurred",
      });
    }
  }
);

const createCourseSlice = createSlice({
  name: "createCourse",
  initialState: {
    loading: false,
    error: null,
    success: null,
    status: null,
    course: null,
  },
  reducers: {
    clearCourseState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.status = null;
      state.course = null; // Clear course data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.status = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Course created successfully!";
        state.status = action.payload.status;
        state.course = action.payload.data; // Store course data on success
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { clearCourseState } = createCourseSlice.actions;
export default createCourseSlice.reducer;
