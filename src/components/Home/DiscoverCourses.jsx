import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory } from '@/redux/api/getCategorySlice';
import { fetchCourses } from '@/redux/api/getCourses';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CourseCard from '../Courses/CourseCard';
import {
  Search,
  SortAsc,
  SortDesc,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Clock,
  Users,
  Menu,
  X
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Latest First', icon: Clock },
  { value: 'courseName', label: 'Course Name A-Z', icon: SortAsc },
  { value: 'instructor', label: 'Instructor A-Z', icon: SortAsc },
  { value: 'price', label: 'Price', icon: TrendingUp },
  { value: 'enrollments', label: 'Most Popular', icon: Users }
];

function DiscoverCourses() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.getCategory);
  const { courses, totalPages, currentPage, loading } = useSelector((state) => state.courses);
  const { loggedIn, user } = useSelector((state) => state.authUser);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [limit, setLimit] = useState(12);
  const [showFilters, setShowFilters] = useState(false); // For mobile filter toggle

  // Initialize categories
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch courses when filters change
  useEffect(() => {
    const categoryIds = selectedCategories.includes('all') || selectedCategories.length === 0
      ? []
      : selectedCategories;

    dispatch(fetchCourses({
      page,
      limit,
      categoryIds,
      search: searchTerm,
      sortBy,
      sortOrder
    }));
  }, [selectedCategories, page, dispatch, searchTerm, sortBy, sortOrder, limit]);

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories((prev) => {
        const newSelection = prev.includes('all') ? [] : [...prev];
        return newSelection.includes(categoryId)
          ? newSelection.filter((id) => id !== categoryId)
          : [...newSelection, categoryId];
      });
    }
    setPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setPage(1);
  };

  const handleOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setPage(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(parseInt(newLimit));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRefresh = () => {
    const categoryIds = selectedCategories.includes('all') || selectedCategories.length === 0
      ? []
      : selectedCategories;

    dispatch(fetchCourses({
      page,
      limit,
      categoryIds,
      search: searchTerm,
      sortBy,
      sortOrder
    }));
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setSelectedCategories(['all']);
    setPage(1);
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  // Get selected category for display
  const getSelectedCategoryName = () => {
    if (selectedCategories.includes('all') || selectedCategories.length === 0) {
      return 'All Categories';
    }
    if (selectedCategories.length === 1) {
      const category = categories?.find(cat => cat._id === selectedCategories[0]);
      return category?.name || 'Unknown Category';
    }
    return `${selectedCategories.length} Categories`;
  };

  // Get current sort option
  const currentSortOption = SORT_OPTIONS.find(option => option.value === sortBy) || SORT_OPTIONS[0];

  // Filter courses based on search (client-side filtering for immediate feedback)
  const filteredCourses = courses?.filter((course) => {
    if (!searchTerm) return true;

    const nameMatch = course.courseName?.toLowerCase().includes(searchTerm.toLowerCase());

    const instructorMatch =
      typeof course.instructor === 'string' &&
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    return nameMatch || instructorMatch;
  }) || [];


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span className="leading-tight">Discover Courses</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Explore our comprehensive collection of educational courses
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <div className="flex border rounded-lg p-0.5 sm:p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-2 sm:px-3"
                >
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-2 sm:px-3"
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Courses</p>
                  <p className="text-lg sm:text-xl font-bold">{courses?.length || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Categories</p>
                  <p className="text-lg sm:text-xl font-bold">{categories?.length || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Filtered Results</p>
                  <p className="text-lg sm:text-xl font-bold">{filteredCourses.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Current Page</p>
                  <p className="text-lg sm:text-xl font-bold">{currentPage || 1}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-6">
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Search for courses, instructors, topics..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary"
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                {showFilters ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {/* Filter Controls */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 items-end">
                {/* Category Filter */}
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={selectedCategories.includes('all') ? 'all' : selectedCategories[0] || 'all'}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="h-9 sm:h-10">
                      <div className="flex items-center gap-2">
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <SelectValue placeholder="Select category" className="truncate">
                          {getSelectedCategoryName()}
                        </SelectValue>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Grid3X3 className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">All Categories</span>
                        </div>
                      </SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Filter */}
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Sort by</label>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="h-9 sm:h-10">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Order & Limit */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleOrderChange}
                    className="h-9 sm:h-10 px-2 sm:px-3 flex-shrink-0"
                    title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                  >
                    {sortOrder === 'asc' ?
                      <SortAsc className="h-3 w-3 sm:h-4 sm:w-4" /> :
                      <SortDesc className="h-3 w-3 sm:h-4 sm:w-4" />
                    }
                  </Button>

                  <Select value={limit.toString()} onValueChange={handleLimitChange}>
                    <SelectTrigger className="w-16 sm:w-20 h-9 sm:h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="36">36</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <div>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="h-9 sm:h-10 w-full text-xs sm:text-sm"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                {!selectedCategories.includes('all') && selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">{getSelectedCategoryName()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-transparent"
                      onClick={() => setSelectedCategories(['all'])}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">"{searchTerm}"</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-transparent"
                      onClick={() => {
                        setSearchInput('');
                        setSearchTerm('');
                      }}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {sortBy !== 'createdAt' && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">Sort: {currentSortOption.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-transparent"
                      onClick={() => setSortBy('createdAt')}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>

              {/* Results Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t gap-2">
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>
                    Showing <strong>{filteredCourses.length}</strong> of <strong>{courses?.length || 0}</strong> courses
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className={`grid gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 ${viewMode === 'grid'
          ? 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
          }`}>
          {loading
            ? Array.from({ length: limit }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-32 sm:h-40 w-full" />
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <Skeleton className="h-4 sm:h-5 w-full" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-7 sm:h-8 flex-1" />
                    <Skeleton className="h-7 sm:h-8 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))
            : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  ButtonName="Enroll Now"
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 sm:py-16 px-4">
                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                  <div className="rounded-full bg-muted p-4 sm:p-6">
                    <Search className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold">No courses found</h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                      We couldn't find any courses matching your search criteria.
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                  <Button variant="outline" onClick={clearAllFilters} className="text-sm">
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex justify-center items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>

                <div className="flex gap-1 overflow-x-auto">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(
                      totalPages - 4,
                      Math.max(1, currentPage - 2)
                    )) + i;

                    if (pageNum > totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm flex-shrink-0"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DiscoverCourses;