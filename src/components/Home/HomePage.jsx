import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { fetchCourses } from "@/redux/api/getCourses";
import { Button } from "@/components/ui/button";
import { ArrowRight, SquareArrowOutUpRightIcon } from "lucide-react";
import CourseCard from "../Courses/CourseCard";
import SerivisesFeatures from "./SerivisesFeatures";
import AdditionalDetails from "./AdditionalDetails";
import Slider from "./slider/Slider";



export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const courses = useSelector((state) => state.courses?.courses || []);
  const loading = useSelector((state) => state.courses?.loading);

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 3, categoryIds: [] }));
  }, [dispatch]);

  return (
    <div>
      <Slider />
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-center mb-6">Popular Courses</h2>

        <div className="flex flex-wrap justify-center gap-5">
          {loading ? (
            <p>Loading courses...</p>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course._id} course={course} ButtonName="Enroll Now" />
            ))
          ) : (
            <p>No courses available.</p>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            className="px-6 py-2 text-sm font-medium"
            onClick={() => navigate("/home/explore")}
          >
            Explore More <SquareArrowOutUpRightIcon className="ml-2" />
          </Button>
        </div>

        <SerivisesFeatures />
      </div>

      <AdditionalDetails />
    </div>
  );
}
