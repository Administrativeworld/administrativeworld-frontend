import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import imageCompression from "browser-image-compression";

// Async thunk to handle image upload and profile update
export const uploadProfilePicture = createAsyncThunk(
  "profile/uploadProfilePicture",
  async ({ file, publicId }, { rejectWithValue }) => {

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

      // 3. Delete previous picture if publicId exists
      if (publicId) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/profile/deleteProfilePicture`,
          { publicId },
          { withCredentials: true }
        );
      }

      // 4. Create formData with required signed fields
      const formData = new FormData();
      formData.append("file", compressedImage);
      formData.append("upload_preset", import.meta.env.VITE_AW_PROFILE_UPLOAD_PRESET);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("signature", signatureData.signature);

      // 5. Upload to Cloudinary
      const { data: cloudinaryData } = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL,
        formData
      );

      const { secure_url, public_id, resource_type, format } = cloudinaryData;

      // 6. Send Cloudinary URL to backend to update user profile
      const { data: backendResponse } = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/profile/updateDisplayPicture`,
        {
          image: secure_url,
          image_public_id: public_id,
          image_resource_type: resource_type,
          image_format: format,
        },
        { withCredentials: true }
      );

      return { imageUrl: secure_url, user: backendResponse };
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
        state.imageUrl = action.payload?.imageUrl || "";
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default displayPicture.reducer;
