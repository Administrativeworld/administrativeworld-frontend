import { Routes, Route, Navigate } from "react-router-dom";
import Form from "./components/Form/Form.jsx";
import { useDispatch, useSelector } from "react-redux";
import { validateUser } from "./redux/api/authUserSlice.js";
import { useEffect } from "react";
import Admin from "./components/Admin/Admin.jsx";
import AdminHome from "./components/Admin/AdminHome.jsx";
import Courses from "./components/Admin/Courses.jsx";
import CoursesList from "./components/Admin/CoursesList.jsx";
import Drafts from "./components/Admin/Drafts.jsx";
import Published from "./components/Admin/Published.jsx";
import CourseBuilderStepper from "./components/Form/CourseBuilderStepper.jsx";
import DiscoverCourses from "./components/Home/DiscoverCourses.jsx";
import Home from "./components/Home/Home.jsx";
import HomePage from "./components/Home/HomePage.jsx";
import CoursePage from "./components/Discover/CoursePage.jsx";
import UserProfile from "./components/User/UserProfile.jsx";
import EnrolledCoursePage from "./components/User/EnrolledCoursePage.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
import ContactUs from "./components/ContactUs/ContactUs.jsx";
import ComingSoon from "./components/AlertScreens/ComingSoon.jsx";
import Categories from "./components/Admin/Categories.jsx";
import PublishedCoursePage from "./components/Admin/NestedComponents/PublishedCoursePage.jsx";

function App() {
  const dispatch = useDispatch();
  const { status, loggedIn, user } = useSelector((state) => state.authUser);

  useEffect(() => {
    if (status === "idle") {
      dispatch(validateUser());
    }
  }, [status, dispatch]);


  return (
    <div>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/home" /> : <Form />}

        />

        {/* Public Routes */}
        <Route path="/home" element={<Home />}>
          <Route index element={<HomePage />} />
          <Route path="course" element={<CoursePage />} />
          <Route path="explore" element={<DiscoverCourses />} />
          <Route path="enrolled" element={loggedIn ? <EnrolledCoursePage /> : < Navigate to="/login" />} />
          <Route path="user" element={loggedIn ? <UserProfile /> : < Navigate to="/login" />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="exams" element={<ComingSoon />} />
          <Route path="notes" element={<ComingSoon />} />
          <Route path="test" element={<ComingSoon />} />
        </Route>

        {/* Admin Routes (Only accessible by Admins) */}
        <Route
          path="/admin"
          element={
            loggedIn && user?.accountType === "Admin" ? (
              <Admin />
            ) : (
              <Navigate to="/home" />
            )
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="course" element={<Courses />}>
            <Route index element={<CoursesList />} />
            <Route path="create" element={<CourseBuilderStepper />} />
            <Route path="draft" element={<Drafts />} />
            <Route path="published" element={<Published />} >
              <Route path=":courseName" element={<PublishedCoursePage />} />
            </Route>

          </Route>
          <Route path="category" element={<Published />}>

          </Route>
        </Route>

        {/* Catch-all Route (Redirect unknown routes to Home) */}
        <Route path="*" element={<Navigate to="/home" text-customOrange />} />
      </Routes>

    </div>
  );
}

export default App;
