import { getACourse } from "@/redux/api/getACourseSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
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
  }, [courseId, dispatch]); // ✅ Added dependencies to avoid stale values

  return <div>
    {course && (
      <>
        <CoursePageHeader
          courseName={course.courseName}
          courseDes={course.courseDescription}
          thumbnail={course.thumbnail}
          category={course.category.name}
        />
        <CourseDetails
          whatYouWillLearn={course.whatYouWillLearn}
          price={course.price}
          thumbnail={course.thumbnail}
          tags={course.tag}
          courseId={course._id}
        />
        <CourseContent
          instructions={course.instructions}
          courseContent={course.courseContent}
        />
      </>
    )
    }

  </div>;
}

export default CoursePage;
