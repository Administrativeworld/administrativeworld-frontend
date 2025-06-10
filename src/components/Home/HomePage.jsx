import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCourses } from "@/redux/api/getCourses";
import AdditionalDetails from "./AdditionalDetails";
import TopRatedCourses from "./TopRatedCourses/TopRatedCourses";
import HeroSection from "./HeroSection/HeroSection";
import axios from "axios";



export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [metaData, setMetaData] = useState();

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const dataResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/metadata/getBasicMetaDataOptimized`);
        setMetaData(dataResponse.data.data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetaData();
  }, []);
  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 3, categoryIds: [] }));
  }, [dispatch]);

  return (
    <div>
      <HeroSection metaData={metaData} />
      <div className="mt-12">
        <div className="">
          <TopRatedCourses metaData={metaData} />
        </div>
      </div>

      <AdditionalDetails metaData={metaData} />
    </div>
  );
}
