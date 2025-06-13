import { getACourse } from '@/redux/api/getACourseSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import EditCourseBuilderStepper from '../EditCourse/EditCourseBuilderStepper';

function PublishedCoursePage() {
  const dispatch = useDispatch();




  return (
    <div>
      <EditCourseBuilderStepper />
    </div>
  );
}

export default PublishedCoursePage