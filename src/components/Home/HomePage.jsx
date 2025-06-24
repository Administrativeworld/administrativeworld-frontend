import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { fetchCourses } from "@/redux/api/getCourses";
import AdditionalDetails from "./AdditionalDetails";
import TopRatedCourses from "./TopRatedCourses/TopRatedCourses";
import HeroSection from "./HeroSection/HeroSection";

import dynamicMetaDataSeo from "@/configs/dynamicMetaDataSeo";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 3, categoryIds: [] }));
  }, [dispatch]);

  const currentUrl = `${import.meta.env.VITE_DOMAIN}${location.pathname}`;

  return (
    <div>
      <HeroSection />
      <div className="mt-12">
        <TopRatedCourses />
      </div>
      <AdditionalDetails />
    </div>
  );
}
