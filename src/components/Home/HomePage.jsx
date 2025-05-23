import { Button } from "@/components/ui/button";
import { ArrowRight, SquareArrowOutUpRightIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CourseCard from "../Courses/CourseCard";
import SerivisesFeatures from "./SerivisesFeatures";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCourses } from "@/redux/api/getCourses";
import AdditionalDetails from "./AdditionalDetails";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 3, categoryIds: [] }));
  }, [dispatch]);

  if (courses) {
    // console.log(courses)
  }

  return (
    <div>
      <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center px-6 md:px-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-60"
          style={{ backgroundImage: "url('/new_hero2.png')" }}
        />


        {/* Overlay Content */}
        <div className="relative z-10 max-w-2xl text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground drop-shadow-lg">
            Your <span className="text-customOrange">Pathway</span> to Serving the <span className="text-customOrange">Nation</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground mt-4 drop-shadow-md">
            Administration world  is a training coching provider based across the india that specialises in accredited and bespoke training courses. We crush the...
          </p>

          {/* Call-to-Action Button */}
          <div className="mt-6">
            <Button className="px-6 py-3 text-lg font-medium">
              Explore Our Content
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Additional Links */}
          <div className="mt-4 flex space-x-6">
            <Link to="/home/explore" className=" hover:underline">Courses</Link>
            <Link to="/home/about" className=" hover:underline">About us</Link>
          </div>
        </div>
      </section>
      <div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Popular Courses</h2>

          <div className=" flex flex-wrap justify-center gap-5">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} ButtonName="Enroll Now" />
            ))}
          </div>


          <div className="flex justify-center mt-6">
            <Button className="px-6 py-2 text-sm font-medium" variant="default" onClick={() => navigate('/home/explore')}>
              Explore More <SquareArrowOutUpRightIcon className="ml-2" />
            </Button>
          </div>
        </div>

        <SerivisesFeatures />
      </div>
      <AdditionalDetails />
    </div>

  );
}
