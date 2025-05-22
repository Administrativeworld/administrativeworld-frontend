import { RupeeSquare } from "@mynaui/icons-react";
import { Bookmark } from "lucide-react";
import PropTypes from "prop-types";
import { BuyCourse } from "@/redux/api/capturePaymentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CourseDetails({ whatYouWillLearn, thumbnail, price, tags, courseId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loggedIn } = useSelector((state) => state.authUser)

  return (
    <div className="w-full max-w-full p-6 flex flex-col sm:flex-row items-center gap-6 backdrop-blur-md  ">
      {/* Course Thumbnail */}
      <div className="w-full sm:w-1/3 flex-shrink-0 overflow-hidden rounded-lg shadow-md">
        <img
          src={thumbnail}
          alt="Course Thumbnail"
          className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Course Details */}
      <div className="flex-1 space-y-4  sm:text-left">
        <p className="text-sm leading-relaxed opacity-80">{whatYouWillLearn}</p>

        {/* Course Price & Tags */}
        <div className="flex flex-col gap-4">
          <p className="text-xl font-semibold">
            <span className="text-2xl font-bold flex flex-row items-center gap-2 text-yellow-500"><RupeeSquare /> {price}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 flex items-center gap-1 py-1 rounded-lg border border-gray-300 text-xs "
              >
                <Bookmark size={15} />  {tag}
              </span>
            ))}
          </div>
          <button className="px-6 py-2 font-bold rounded-lg shadow-md border border-yellow-500 text-yellow-500 hover:text-white hover:bg-yellow-500 transition"
            onClick={() => {
              if (loggedIn) {
                BuyCourse(user.token, courseId, user, navigate, dispatch); // Now passing courseId
              } else {
                navigate('/login');
              }
            }}

          >
            Enroll Now
          </button>

        </div>
      </div>
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
