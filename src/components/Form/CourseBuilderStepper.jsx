import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CourseInfo from "./CourseInfo";
import CourseSections from "./CourseSections";
import Publish from "./Publish";

const StepOne = () => <CourseInfo />;
const StepTwo = () => <CourseSections />;
const StepThree = () => <Publish />;

const steps = [StepOne, StepTwo, StepThree];

const CourseBuilderStepper = () => {
  const step = useSelector((state) => state.courseBuilder.step);
  const StepComponent = steps[step];

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <Progress value={(step + 1) * 33.33} className="mb-4" />
      <CardContent>
        <StepComponent />
      </CardContent>
    </Card>
  );
};

export default CourseBuilderStepper;