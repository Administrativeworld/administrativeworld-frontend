import PropTypes from "prop-types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { enableEditMode } from "@/redux/api/courseBuilderSlice";

function CourseCard({ course, ButtonName, path }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, user } = useSelector((state) => state.authUser);
  // Defensive check: return nothing if course is missing
  if (!course || typeof course !== "object") return null;

  // Get rating from course.avgRating or show N/A
  const rating = course.avgRating && typeof course.avgRating === 'number' && !isNaN(course.avgRating)
    ? course.avgRating
    : null;

  const isEnrolled = (courseId) => {
    return loggedIn && user && user.courses?.length
      ? user.courses.some((course) => course._id.toString() === courseId.toString())
      : false;
  };
  return (
    <div className="flex justify-center">
      <Card className="group w-[250px] md:w-[270px] lg:w-[290px] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {course.category?.name && (
            <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-customOrange text-xs font-medium px-2 py-1 rounded-full">
              {course.category.name}
            </span>
          )}

          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <Avatar className="w-7 h-7 border-2 border-white" />
            <span className="text-xs text-white font-medium">
              {course.instructor?.firstName ?? ""}{" "}
              {course.instructor?.lastName ?? ""}
            </span>
          </div>
        </div>

        <CardContent className="p-2">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-bold leading-tight line-clamp-2">
              {course.courseName}
            </h2>
            <p className="text-md font-bold text-customOrange ml-2">
              {isEnrolled(course._id)
                ? "Enrolled"
                : `₹${course.price?.toLocaleString("en-IN") ?? "0"}`}
            </p>
          </div>

          <p className="text-xs text-brightness-75 mb-1 line-clamp-2">
            {course.courseDescription}
          </p>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${rating && i + 0.5 <= rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300 stroke-current"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs">
              {rating ? rating.toFixed(1) : 'N/A'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {course.tag?.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs font-medium border text-customOrange px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t w-full mb-1"></div>
          {ButtonName === "Inspect" ? (
            <Button
              className="w-full mt-auto font-medium py-1.5 rounded-md transition-colors duration-200"
              variant="outline"
              onClick={() => { navigate(path); dispatch(enableEditMode()) }}
            >
              Inspect
            </Button>
          ) : isEnrolled(course._id) ? (
            <Button
              className="w-full mt-auto font-medium py-1.5 rounded-md transition-colors duration-200"
              variant="outline"
              onClick={() => navigate(`/home/enrolled?id=${course._id}`)}
            >
              Continue Learning
            </Button>
          ) : (
            <Button
              className="w-full mt-auto font-medium py-1.5 rounded-md transition-colors duration-200"
              variant="outline"
              onClick={() => navigate(`/home/course?id=${course._id}`)}
            >
              Enroll Now
            </Button>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    courseName: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    courseDescription: PropTypes.string.isRequired,
    avgRating: PropTypes.number,
    tag: PropTypes.arrayOf(PropTypes.string).isRequired,
    instructor: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  ButtonName: PropTypes.string,
  Path: PropTypes.string
};

export default CourseCard;