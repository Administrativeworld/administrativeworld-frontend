import { useLocation } from "react-router-dom";
import { ScanEye, Search, Ellipsis, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getPublishedCourses } from "@/redux/api/getPublishedCourseSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { getCategory } from "@/redux/api/getCategorySlice";
import { fetchCourses } from "@/redux/api/getCourses";
import CourseCard from "@/components/Courses/CourseCard";
import { Outlet } from "react-router-dom";
import CourseSelectionModal from "../CourseSelectionModal";
import ExerciseForm from "../ExerciseForm";
import axios from "axios";
import toast from "react-hot-toast";

function Published() {
  const location = useLocation();
  const dispatch = useDispatch();
  const publishedCourses = useSelector((state) => state.publishedCourses.publishedCourses.data);
  const { categories } = useSelector((state) => state.getCategory);
  const { courses, totalPages, currentPage, loading } = useSelector((state) => state.courses);
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showCourseSelection, setShowCourseSelection] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  useEffect(() => {
    dispatch(getPublishedCourses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (categoryId === "all") {
        return ["all"];
      }
      const newSelection = prev.includes("all") ? [] : [...prev];
      return newSelection.includes(categoryId)
        ? newSelection.filter((id) => id !== categoryId)
        : [...newSelection, categoryId];
    });
    setPage(1);
  };

  useEffect(() => {
    const categoryIds =
      selectedCategories.includes("all") || selectedCategories.length === 0
        ? []
        : selectedCategories;

    dispatch(fetchCourses({ page, limit: 15, categoryIds }));
  }, [selectedCategories, page, dispatch]);

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.includes("all") || selectedCategories.includes(course.category._id);
    return matchesSearch && matchesCategory;
  }) || [];

  const isBasePublishedRoute = location.pathname === "/admin/course/published" || location.pathname === "/admin/course/published/";

  const handleCreateExercise = () => {
    setShowCourseSelection(true);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowCourseSelection(false);
    setShowExerciseForm(true);
  };

  const handleExerciseSubmit = async (exerciseData) => {
    // Handle exercise submission logic here
    console.log("Exercise submitted:", exerciseData);
    const submitResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/exercise/create`,
      { exerciseData }, { withCredentials: true }
    )
    console.log(submitResponse)
    if (submitResponse.status === 200) {
      toast.success("Execrise Created")
    }
    setShowExerciseForm(false);
    setSelectedCourse(null);
  };

  const handleBack = () => {
    if (showExerciseForm) {
      setShowExerciseForm(false);
      setShowCourseSelection(true);
    } else {
      setShowCourseSelection(false);
      setSelectedCourse(null);
    }
  };

  return (
    <div>
      {/* Show course list only on base route */}
      {isBasePublishedRoute && (
        <>
          <div className="p-2 flex items-center justify-between">
            <div className="relative w-full mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                className="pl-10 py-5"
                type="search"
                id="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateExercise} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Exercise
            </Button>
          </div>

          <div className="flex flex-row items-center gap-2 mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Categories <Ellipsis className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 md:w-72 max-h-60 overflow-y-auto"
                side="bottom"
                align="start"
              >
                <DropdownMenuLabel className="font-semibold">Select Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                  checked={selectedCategories.includes("all")}
                  onCheckedChange={() => handleCategoryToggle("all")}
                >
                  All
                </DropdownMenuCheckboxItem>

                <div className="max-h-48 overflow-y-auto">
                  {categories?.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category._id}
                      checked={selectedCategories.includes(category._id)}
                      onCheckedChange={() => handleCategoryToggle(category._id)}
                    >
                      {category.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4">
            <strong className="text-2xl">Available Courses</strong>
            <div className="flex flex-wrap justify-center mt-3 gap-4">
              {loading ? (
                <p className="text-gray-500">Loading courses...</p>
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <CourseCard key={course._id} course={course} ButtonName="Inspect" path={`/admin/course/published/edit?id=${course._id}`} />
                ))
              ) : (
                <p className="text-gray-500">No courses found</p>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center mt-6 gap-4">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Course Selection Modal */}
      <CourseSelectionModal
        open={showCourseSelection}
        onClose={() => setShowCourseSelection(false)}
        onCourseSelect={handleCourseSelect}
        courses={filteredCourses}
        loading={loading}
      />

      {/* Exercise Form Modal */}
      <ExerciseForm
        open={showExerciseForm}
        onClose={() => setShowExerciseForm(false)}
        onSubmit={handleExerciseSubmit}
        course={selectedCourse}
        onBack={handleBack}
      />

      {/* Nested Routes Render Here */}
      <Outlet />
    </div>
  );
}

export default Published;