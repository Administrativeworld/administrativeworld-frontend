import { configureStore } from "@reduxjs/toolkit";
import signupSlice from "./api/signupSlice";
import FormDataSlice from "./global/FormdataSlice";
import GlobalVarSlice from "./global/GlobalVar";
import loginSlice from "./api/loginSlice";
import authUserSlice from "./api/authUserSlice";
import createCourseSlice from "./api/createCourseSlice"; // Import the createCourseSlice
import getCategorySlice from "./api/getCategorySlice";
import getDraftCourses from "./api/getDraftCourseSlice";
import getPublishedCourses from "./api/getPublishedCourseSlice";
import courseBuilderSlice from "./api/courseBuilderSlice"
import createSection from "./api/createSection";
import createSubSection from "./api/createSubSection";
import publishCourse from "./api/publishCourse";
import getCoursesReducer from "./api/getCourses";
import getACourse from "./api/getACourseSlice";
import fetchEnrolledCourses from "./api/fetchEnrolledCourses";
import updateProfile from "./api/updateProfileSlice";
import uploadProfilePicture from "./api/displayPicture";
import fetchLearningCourse from "./api/learningCourseSlice";
import manualEnrollStudent from "./api/manaulEnroll";
import fetchBooks from "./api/booksSlice";

export const reduxStore = configureStore({
  reducer: {
    signup: signupSlice,
    formData: FormDataSlice,
    globalVar: GlobalVarSlice,
    login: loginSlice,
    authUser: authUserSlice,
    createCourse: createCourseSlice, // Add the createCourseSlice here
    getCategory: getCategorySlice,
    draftCourses: getDraftCourses,
    publishedCourses: getPublishedCourses,
    courseBuilder: courseBuilderSlice,
    createSection: createSection,
    createSubSection: createSubSection,
    publishCourse: publishCourse,
    courses: getCoursesReducer,
    getACourse: getACourse,
    enrolledCourses: fetchEnrolledCourses,
    updateProfile: updateProfile,
    displayPicture: uploadProfilePicture,
    fetchLearningCourse: fetchLearningCourse,
    manualEnrollStudent: manualEnrollStudent,
    books: fetchBooks
  }
});