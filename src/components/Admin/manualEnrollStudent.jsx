import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "@/redux/api/getCourses";
import { manualEnrollStudent, clearEnrollState } from "@/redux/api/manaulEnroll";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const AdminEnrollStudentForm = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const courses = useSelector((state) => state.courses.courses);
  const courseLoading = useSelector((state) => state.courses.loading);
  const enrollLoading = useSelector((state) => state.manualEnrollStudent.loading);

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourseId || !email) {
      toast.error("Missing course or email");
      return;
    }

    try {
      await dispatch(
        manualEnrollStudent({ email, courseId: selectedCourseId })
      ).unwrap();
      toast.success("User manually enrolled");
      setEmail("");
      setSelectedCourseId("");
      dispatch(clearEnrollState());
    } catch (error) {
      toast.error("Enrollment Failed");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Manually Enroll a Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Student Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={enrollLoading}
            />
          </div>

          <div>
            <Label htmlFor="course">Select Course</Label>
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
              disabled={courseLoading}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={enrollLoading}>
            {enrollLoading ? "Enrolling..." : "Enroll Student"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminEnrollStudentForm;
