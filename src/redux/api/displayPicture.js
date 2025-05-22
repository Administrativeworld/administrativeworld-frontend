import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import imageCompression from "browser-image-compression";

// Async thunk to handle image upload and profile update
export const uploadProfilePicture = createAsyncThunk(
  "profile/uploadProfilePicture",
  async (file, { rejectWithValue }) => {
    // try {
    //   if (!file) {
    //     return rejectWithValue("No file selected");
    //   }

    //   // Image compression options
    //   const options = {
    //     maxSizeMB: 1, // Max size 1MB
    //     maxWidthOrHeight: 1000, // Max width/height 1000px
    //     useWebWorker: true, // Improve performance
    //   };

    //   // Compress image
    //   const compressedImage = await imageCompression(file, options);

    //   // Prepare FormData for Cloudinary upload
    //   const formData = new FormData();
    //   formData.append("file", compressedImage);
    //   formData.append("VITE_AW_PROFILE_UPLOAD_PRESET", "aw-images"); // Set Cloudinary preset

    //   // Upload to Cloudinary
    //   const cloudinaryResponse = await axios.post(
    //     import.meta.env.VITE_CLOUDINARY_URL, // Cloudinary upload URL
    //     formData
    //   );

    //   const imageUrl = cloudinaryResponse.data.secure_url;

    //   // Send the Cloudinary URL to the backend API
    //   const backendResponse = await axios.put(
    //     `${import.meta.env.VITE_BASE_URL}/profile/updateDisplayPicture`, // Your API endpoint
    //     { imageUrl },
    //     { withCredentials: true }
    //   );

    //   return backendResponse.data; // Return response data
    // } catch (error) {
    //   return rejectWithValue(error.response?.data?.message || "Upload failed");
    // }
    try {
      if (!file) {
        return rejectWithValue("No file selected");
      }

      // 1. Compress image before uploading
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressedImage = await imageCompression(file, options);
      // 2. Request signature from backend
      const { data: signatureData } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/generate/generateSignature`,
        { uploadPreset: import.meta.env.VITE_AW_PROFILE_UPLOAD_PRESET }
      );
      // console.log({ signatureData: signatureData.signature })
      // 3. Create formData with required signed fields
      const formData = new FormData();
      formData.append("file", compressedImage);
      formData.append("upload_preset", import.meta.env.VITE_AW_PROFILE_UPLOAD_PRESET);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("signature", signatureData.signature);

      // 4. Upload to Cloudinary
      const cloudinaryResponse = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL,
        formData
      );
      const imageUrl = cloudinaryResponse.data.secure_url;

      // 5. Send Cloudinary URL to your backend API to update user profile
      const backendResponse = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/profile/updateDisplayPicture`,
        { imageUrl },
        { withCredentials: true }
      );

      return backendResponse.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  }
);

// Redux slice
const displayPicture = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    error: null,
    success: false,
    imageUrl: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.imageUrl = action.payload?.data?.image || "";
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default displayPicture.reducer;
