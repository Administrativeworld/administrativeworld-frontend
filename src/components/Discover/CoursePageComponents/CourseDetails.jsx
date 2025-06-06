import { Bookmark, IndianRupee } from "lucide-react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buyCourse } from "@/configs/capturePaymentSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function CourseDetails({ whatYouWillLearn, thumbnail, price, tags, courseId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loggedIn } = useSelector((state) => state.authUser);

  const handleEnrollClick = () => {
    if (loggedIn) {
      buyCourse(courseId, user, navigate,

      );
    } else {
      navigate('/login');
    }
    console.log('Enroll clicked for course:', courseId);
  };

  return (
    <div className="w-full max-w-full p-6">
      <Card className="backdrop-blur-md border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Course Thumbnail */}
            <div className="w-full sm:w-1/3 flex-shrink-0 overflow-hidden rounded-lg shadow-md">
              <img
                src={thumbnail}
                alt="Course Thumbnail"
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Course Details */}
            <div className="flex-1 space-y-4 sm:text-left">
              <p className="text-sm leading-relaxed opacity-80">{whatYouWillLearn}</p>

              {/* Course Price & Tags */}
              <div className="flex flex-col gap-4">
                <p className="text-xl font-semibold">
                  <span className="text-2xl font-bold flex flex-row items-center gap-2 text-yellow-500">
                    <IndianRupee className="w-5 h-5" /> {price}
                  </span>
                </p>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 text-xs hover:bg-muted/50 transition-colors"
                    >
                      <Bookmark className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="px-6 py-2 font-bold border-yellow-500 text-yellow-500 hover:text-white hover:bg-yellow-500 transition-colors"
                  onClick={handleEnrollClick}
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

CourseDetails.propTypes = {
  whatYouWillLearn: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  courseId: PropTypes.string.isRequired
};

export default CourseDetails;