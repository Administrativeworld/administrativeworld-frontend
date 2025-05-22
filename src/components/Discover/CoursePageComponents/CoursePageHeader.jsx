import PropTypes from "prop-types";
import { CalendarDays, Clock, Award, Star, ChartBarStacked } from "lucide-react";

function CoursePageHeader({ courseName, courseDes, thumbnail, category }) {
  const rating = 2;
  return (
    <div
      className="relative w-full  overflow-hidden shadow-lg"
      style={{ backgroundImage: `url(${thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm" />

      {/* Category Badge */}
      <div className="absolute flex items-center gap-1 top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
        <ChartBarStacked size={20} />{category}
      </div>

      <div className="relative z-10 p-6 md:p-12 text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-center">
          {/* Left Content */}
          <div className="flex-1 space-y-6  lg:text-left">
            {/* Title and Description */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {courseName}
              </h1>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                {courseDes}
              </p>
            </div>

            {/* Course Stats */}
            <div className="flex flex-wrap  lg:justify-start gap-6 py-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 md:w-5 h-4 md:h-5 text-yellow-400" />
                <span className="text-xs md:text-sm">8 weeks</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CalendarDays className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
                <span className="text-xs md:text-sm">Self-paced</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Award className="w-4 md:w-5 h-4 md:h-5 text-green-400" />
                <span className="text-xs md:text-sm">Certificate</span>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center lg:justify-start gap-1 text-yellow-400">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className={`w-4 md:w-5 h-4 md:h-5 ${index < rating ? 'fill-current' : 'stroke-current'}`} />
              ))}
              <span className="text-xs md:text-sm text-gray-300 ml-2">{rating.toFixed(1)} / 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CoursePageHeader.propTypes = {
  courseName: PropTypes.string,
  courseDes: PropTypes.string.isRequired,
  // rating: PropTypes.number.isRequired,
  thumbnail: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};

export default CoursePageHeader;
