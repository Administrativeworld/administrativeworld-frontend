import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getACourse } from "@/redux/api/getACourseSlice";

import CoursePageHeader from "./CoursePageComponents/CoursePageHeader";
import CourseDetails from "./CoursePageComponents/CourseDetails";
import CourseContent from "./CoursePageComponents/CourseContent";

function CoursePage() {
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.getACourse);
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");

  useEffect(() => {
    if (courseId) {
      dispatch(getACourse(courseId));
    }
  }, [courseId, dispatch]);

  const isContentArray = Array.isArray(course?.courseContent);

  return (
    <div>
      {course ? (
        <>
          <CoursePageHeader
            courseName={course.courseName || "Unnamed Course"}
            courseDes={course.courseDescription || ""}
            thumbnail={course.thumbnail || ""}
            category={course.category?.name || "Uncategorized"}
          />
          <CourseDetails
            whatYouWillLearn={course.whatYouWillLearn || []}
            price={course.price || 0}
            thumbnail={course.thumbnail || ""}
            tags={course.tag || []}
            courseId={course._id || ""}
          />
          {isContentArray && (
            <CourseContent
              instructions={course.instructions || []}
              courseContent={course.courseContent}
            />
          )}
        </>
      ) : (
        <p>Loading course data...</p>
      )}
    </div>
  );
}

export default CoursePage;
