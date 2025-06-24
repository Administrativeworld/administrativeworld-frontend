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
      <Helmet>
        <title>{dynamicMetaDataSeo.home.title}</title>
        <meta name="description" content={dynamicMetaDataSeo.home.description} />
        <meta name="keywords" content={dynamicMetaDataSeo.home.keywords} />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:title" content={dynamicMetaDataSeo.home.title} />
        <meta property="og:description" content={dynamicMetaDataSeo.home.description} />
        <meta property="og:image" content={dynamicMetaDataSeo.home.ogImage} />
        <meta property="og:url" content={currentUrl} />
      </Helmet>

      <HeroSection />
      <div className="mt-12">
        <TopRatedCourses />
      </div>
      <AdditionalDetails />
    </div>
  );
}
