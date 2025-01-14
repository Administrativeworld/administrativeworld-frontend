import { configureStore } from "@reduxjs/toolkit";
import signupSlice from "./api/signupSlice";
import FormDataSlice from "./global/FormdataSlice"
import GlobalVarSlice from "./global/GlobalVar";
import loginSlice from "./api/loginSlice";
import authUserSlice from "./api/authUserSlice"

export const reduxStore = configureStore({
  reducer: {
    signup: signupSlice,
    formData: FormDataSlice,
    globalVar: GlobalVarSlice,
    login: loginSlice,
    authUser: authUserSlice,
  }
});

