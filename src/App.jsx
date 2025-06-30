import { Routes, Route, Navigate } from "react-router-dom";
import Form from "./components/Form/Form.jsx";
import { useDispatch, useSelector } from "react-redux";
import { validateUser } from "./redux/api/authUserSlice.js";
import { useEffect, useState } from "react";

// Import all components
import Admin from "./components/Admin/Admin.jsx";
import AdminHome from "./components/Admin/AdminHome.jsx";
import Courses from "./components/Admin/Courses.jsx";
import CoursesList from "./components/Admin/CoursesList.jsx";
import Drafts from "./components/Admin/Drafts.jsx";
import Published from "./components/Admin/PublishedCoursePage/Published.jsx";
import CourseBuilderStepper from "./components/Admin/CreateCourses/CourseBuilderStepper.jsx";
import DiscoverCourses from "./components/Home/DiscoverCourses.jsx";
import Home from "./components/Home/Home.jsx";
import HomePage from "./components/Home/HomePage.jsx";
import CoursePage from "./components/Discover/CoursePage.jsx";
import UserProfile from "./components/User/UserProfile.jsx";
import EnrolledCoursePage from "./components/User/EnrolledCourse/EnrolledCoursePage.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
import ContactUs from "./components/ContactUs/ContactUs.jsx";
import Categories from "./components/Admin/Categories.jsx";
import ResetPasswordPage from "./components/Form/ResetPasswordPage.jsx";
import AdminEnrollStudentForm from "./components/Admin/manualEnrollStudent.jsx";
import Books from "./components/Admin/Books/Books.jsx";
import CreateBook from "./components/Admin/Books/CreateBook/CreateBook.jsx";
import BooksIndex from "./components/Admin/Books/BooksIndex.jsx";
import Store from "./components/Store/Store.jsx";
import PublishedBooks from "./components/Admin/Books/Published/PublishedBooks.jsx";
import CreateCombo from "./components/Admin/Books/Published/CreateCombo.jsx";
import CouponDashboard from "./components/Admin/Coupons/CouponDashboard.jsx";
import CouponForm from "./components/Admin/Coupons/CouponForm.jsx";
import CouponCard from "./components/Admin/Coupons/CouponCard.jsx";
import EditBook from "./components/Admin/Books/EditBook/EditBook.jsx";
import ExerciseManagement from "./components/Admin/CourseExecrise/Management/ExerciseManagement.jsx";
import EditCourseBuilderStepper from "./components/Admin/EditCourse/EditCourseBuilderStepper.jsx";

// Import the 404 component
import NotFound from "./components/NotFoundPage/NotFound.jsx";

// Loading Component
import React from 'react';
import CanvasEditor from "./components/Admin/CourseExecrise/Management/CanvasEditor.jsx";
import Article from "./components/Admin/Articles/ArticlePanel.jsx";
import ArticleCreateSteps from "./components/Admin/Articles/CreateArticle/ArticleCreateSteps.jsx";
import ArticlePanelComponent from "./components/Admin/Articles/ArticlePanelComponent/ArticlePanelComponent.jsx";
import ArticlePanel from "./components/Admin/Articles/ArticlePanel.jsx";
import PublishedArticle from "./components/Admin/Articles/PublishedArticle/PublishedArticle.jsx";
import Articles from "./components/Articles/Articles.jsx";
import ReadArticle from "./components/Articles/ReadArticle.jsx";

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="relative">
      {/* Spinning border - exactly same as original */}
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-foreground"></div>

      {/* Company logo in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {<img src="https://res.cloudinary.com/dqvkbnrlu/image/upload/v1749396329/apple-touch-icon_tgjqag.png" alt="" /> || "AW"}
          </span>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { status, loggedIn, user } = useSelector((state) => state.authUser);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Only validate if we're in idle state and document is ready
      if (status === "idle" && document.readyState === 'complete') {
        try {
          await dispatch(validateUser());
        } catch (error) {
          console.log('Auth validation failed:', error);
        }
      }

      // Set initializing to false after validation attempt
      setTimeout(() => {
        setIsInitializing(false);
      }, 150); // Slightly longer delay
    };

    // Wait a bit if document isn't ready
    if (document.readyState !== 'complete') {
      window.addEventListener('load', initializeAuth);
      return () => window.removeEventListener('load', initializeAuth);
    } else {
      initializeAuth();
    }
  }, [status, dispatch]);

  // Show loading screen while initializing authentication
  if (isInitializing || status === "loading") {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Routes>
        {/* Root Route - Redirect to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Login Route */}
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/home" replace /> : <Form />}
        />

        {/* Reset Password Route */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Public Routes */}
        <Route path="home" element={<Home />}>
          <Route index element={<HomePage />} />
          <Route path="course" element={<CoursePage />} />
          <Route path="explore" element={<DiscoverCourses />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="store" element={<Store />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:slug" element={<ReadArticle />} />

          {/* Protected User Routes */}
          <Route
            path="enrolled"
            element={loggedIn ? <EnrolledCoursePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="user"
            element={loggedIn ? <UserProfile /> : <Navigate to="/login" replace />}
          />

          {/* Catch-all for /home subroutes */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes (Only accessible by Admins) */}
        <Route
          path="/admin/*"
          element={
            loggedIn && user?.accountType === "Admin" ? (
              <AdminRoutes />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* 404 Route - Must be last (Catch-all for unknown routes) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// Separate Admin Routes Component to avoid nesting issues
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />}>
        <Route index element={<AdminHome />} />

        {/* Course Management Routes */}
        <Route path="course" element={<Courses />}>
          <Route index element={<CoursesList />} />
          <Route path="create" element={<CourseBuilderStepper />} />
          <Route path="draft" element={<Drafts />} />
          <Route path="published" element={<Published />}>
            <Route path=":courseName" element={<EditCourseBuilderStepper />} />
            <Route path="execrise" element={<ExerciseManagement />} />
            <Route path="execrise/canvas" element={<CanvasEditor />} />

          </Route>
        </Route>

        {/* Books Management Routes */}
        <Route path="books" element={<Books />}>
          <Route index element={<BooksIndex />} />
          <Route path="create" element={<CreateBook />} />
          <Route path="published" element={<PublishedBooks />} />
          <Route path="published/edit" element={<EditBook />} />
          <Route path="published/createcombo" element={<CreateCombo />} />
        </Route>

        {/* Article managment  */}
        <Route path="article" element={<ArticlePanel />}>
          <Route index element={<ArticlePanelComponent />} />
          <Route path="create" element={<ArticleCreateSteps />} />
          <Route path="published" element={<PublishedArticle />} />
          <Route path="published/edit" element={<ArticleCreateSteps isEditMode={true} />} />
        </Route>

        {/* Other Admin Routes */}
        <Route path="enrolluser" element={<AdminEnrollStudentForm />} />
        <Route path="category" element={<Categories />} />
        <Route path="coupon" element={<CouponDashboard />} />
        <Route path="coupon/create" element={<CouponForm />} />
        <Route path="coupon/edit" element={<CouponCard />} />

        {/* Catch-all for /admin subroutes */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;