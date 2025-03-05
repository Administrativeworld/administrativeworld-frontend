import PropTypes from "prop-types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EnrolledCourseCard({ course, ButtonName }) {
  const rating = 4.5; // Dummy rating value
  const navigate = useNavigate();

  return (
    <div className="flex justify-center ">
      <Card className="group w-[250px] md:w-[270px] lg:w-[290px] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-customOrange text-xs font-medium px-2 py-1 rounded-full">
            {course.category}
          </span>
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <Avatar className="w-7 h-7 border-2 border-white" />
            <span className="text-xs text-white font-medium">
              {course.instructor?.firstName} {course.instructor?.lastName}
            </span>
          </div>
        </div>

        <CardContent className="p-2">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-bold leading-tight line-clamp-2">
              {course.courseName}
            </h2>
            <p className="text-md font-bold text-customOrange ml-2">
              {course.price === "Enrolled" ? course.price : `₹${course.price.toLocaleString("en-IN")}`}
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
                  className={`${i + 0.5 <= rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300 stroke-current"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs">{rating}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {course.tag?.map((tag, index) => (
              <span
                key={index}
                className="text-xs font-medium border text-customOrange px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t w-full mb-1"></div>

          <Button
            className="w-full font-medium py-1.5 rounded-md transition-colors duration-200"
            variant="outline"
            onClick={() => navigate(`/home/enrolled?id=${course._id}`)}
          >
            {ButtonName}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

EnrolledCourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    courseName: PropTypes.string.isRequired,
    courseDescription: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    thumbnail: PropTypes.string.isRequired,
    instructor: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    tag: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  ButtonName: PropTypes.string.isRequired,
};

export default EnrolledCourseCard;
