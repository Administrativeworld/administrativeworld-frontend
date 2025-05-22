import { Ellipsis, Search } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "@/redux/api/getCategorySlice";
import { fetchCourses } from "@/redux/api/getCourses";
import { Input } from "../ui/input";
import CourseCard from "../Courses/CourseCard";

function DiscoverCourses() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.getCategory);
  const { courses, totalPages, currentPage, loading } = useSelector((state) => state.courses);
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const { loggedIn, user } = useSelector((state) => state.authUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);
  // Handle category selection toggle
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (categoryId === "all") {
        return ["all"];
      }

      // If "All" was previously selected, remove it
      const newSelection = prev.includes("all") ? [] : [...prev];

      return newSelection.includes(categoryId)
        ? newSelection.filter((id) => id !== categoryId)
        : [...newSelection, categoryId];
    });

    setPage(1);
  };

  // Fetch courses when categories or page changes
  useEffect(() => {
    const categoryIds =
      selectedCategories.includes("all") || selectedCategories.length === 0
        ? [] // Send empty array for all categories
        : selectedCategories;

    dispatch(fetchCourses({ page, limit: 15, categoryIds }));
  }, [selectedCategories, page, dispatch]);

  // Filter courses based on search term and selected categories
  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.includes("all") ||
      selectedCategories.includes(course.category._id);
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row items-center gap-5">
        {/* Search Bar */}
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            className="pl-10 py-2 w-full md:w-72"
            type="text"
            placeholder="Search Courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex flex-row items-center gap-2">
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

              {/* "All" option */}
              <DropdownMenuCheckboxItem
                checked={selectedCategories.includes("all")}
                onCheckedChange={() => handleCategoryToggle("all")}
              >
                All
              </DropdownMenuCheckboxItem>

              {/* Scrollable category list */}
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
      </div>

      {/* Course List */}
      <div className="mt-4">
        <strong className="text-2xl">Available Courses</strong>
        <div className="flex flex-wrap justify-center mt-3 gap-4">
          {loading ? (
            <p className="text-gray-500">Loading courses...</p>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} ButtonName="Enroll Now" />
            ))
          ) : (
            <p className="text-gray-500">No courses found</p>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
}

export default DiscoverCourses;