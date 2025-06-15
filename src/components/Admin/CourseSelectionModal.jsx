import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { BookOpen, Users, Star } from "lucide-react";

const CourseSelectionModal = ({ open, onClose, onCourseSelect, courses, loading }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Select a Course</DialogTitle>
          <DialogDescription>
            Choose a course to create an exercise for. You can add exercises to any section within the selected course.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500">Loading courses...</p>
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course._id} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="aspect-video w-full mb-3 overflow-hidden rounded-md">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {course.courseName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {course.courseDescription}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {course.category?.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ${course.price}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{course.courseContent?.length || 0} sections</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{course.purchases} enrolled</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{course.avgRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => onCourseSelect(course)}
                      className="w-full"
                      size="sm"
                    >
                      Select Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500">No courses found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseSelectionModal;