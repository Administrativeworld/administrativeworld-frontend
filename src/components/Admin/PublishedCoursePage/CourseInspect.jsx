import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, BookOpen } from "lucide-react";

function CourseInspect({ course }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditCourse = () => {
    navigate(`/admin/course/published/edit?id=${course._id}`);
    setOpen(false);
    console.log(course)
  };

  const handleManageExercises = () => {
    navigate(`/admin/course/published/execrise?id=${course._id}`);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full mt-auto font-medium py-1.5 rounded-md transition-colors duration-200"
          variant="outline"
        >
          Inspect
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Course Management</AlertDialogTitle>
          <AlertDialogDescription>
            Choose an action for "{course.courseName}"
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <Button
            onClick={handleEditCourse}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Edit size={16} />
            Edit Course
          </Button>

          <Button
            onClick={handleManageExercises}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <BookOpen size={16} />
            Manage Exercises
          </Button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

CourseInspect.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    courseName: PropTypes.string.isRequired,
  }).isRequired,
};

export default CourseInspect;