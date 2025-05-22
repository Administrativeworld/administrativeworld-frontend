import { useLocation } from "react-router-dom";
import { ScanEye, Search, Ellipsis } from "lucide-react";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getPublishedCourses } from "@/redux/api/getPublishedCourseSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getCategory } from "@/redux/api/getCategorySlice";
import { fetchCourses } from "@/redux/api/getCourses";
import CourseCard from "../Courses/CourseCard";
import { Outlet } from "react-router-dom";

function Published() {
  const location = useLocation(); // ✅ Access pathname
  const dispatch = useDispatch();
  const publishedCourses = useSelector((state) => state.publishedCourses.publishedCourses.data);
  const { categories } = useSelector((state) => state.getCategory);
  const { courses, totalPages, currentPage, loading } = useSelector((state) => state.courses);
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

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

  return (
    <div>
      {/* Show course list only on base route */}
      {isBasePublishedRoute && (
        <>
          <div className="p-2 flex items-center">
            <div className="relative w-full">
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
                  <CourseCard key={course._id} course={course} ButtonName="Inspect" path={`/admin/course/published/${course.courseName}?id=${course._id}`} />
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

      {/* Nested Routes Render Here */}
      <Outlet />
    </div>
  );
}

export default Published;
