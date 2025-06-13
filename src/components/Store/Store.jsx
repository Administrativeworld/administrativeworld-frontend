import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, setFilters } from '../../redux/api/booksSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BookCard from './BookCard/BookCard'; // Import the separate BookCard component
import {
  Search,
  SortAsc,
  SortDesc,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  ChevronDown,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Clock,
  Menu,
  X,
  Package,
  Star,
  Mail
} from 'lucide-react';
import BookComboCard from './BookCombo/BookComboCard';
import { fetchBookCombos } from '@/redux/api/fetchBookComboSlice';

// Sample data - replace with your actual data
const AUTHORS = [
  'All Authors',
  'Robun',
  'Prashant',
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: Grid3X3 },
  { value: 'Notes', label: 'Study Notes', icon: BookOpen },
  { value: 'TestSeries', label: 'Test Series', icon: GraduationCap },
  { value: 'Material', label: 'Study Material', icon: List },
  { value: 'Books', label: 'Books', icon: BookOpen }
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Latest First', icon: Clock },
  { value: 'title', label: 'Title A-Z', icon: SortAsc },
  { value: 'author', label: 'Author A-Z', icon: SortAsc },
  { value: 'price', label: 'Price', icon: TrendingUp },
  { value: 'purchases', label: 'Most Popular', icon: TrendingUp }
];

export default function Store() {
  const dispatch = useDispatch();
  const { books, loading, filters, meta } = useSelector((state) => state.books);

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [authorInput, setAuthorInput] = useState(filters.author || '');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false); // For mobile filter toggle
  const { combos, error } = useSelector((state) => state.bookCombos);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        dispatch(setFilters({ search: searchInput, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch, filters.search]);
  //fetch combo
  useEffect(() => {
    dispatch(fetchBookCombos());
  }, [dispatch]);
  let totalAvgSavings = 0
  combos.forEach((combo) => {
    const originalTotal = combo.comboPrice;
    const finalPrice = combo.finalPrice;
    const savings = originalTotal - finalPrice;
    const percentage = Math.round((savings / originalTotal) * 100);
    totalAvgSavings = totalAvgSavings + percentage
  })

  // Debounced author filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (authorInput !== filters.author) {
        dispatch(setFilters({ author: authorInput, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [authorInput, dispatch, filters.author]);

  // Fetch books when filters change
  useEffect(() => {
    dispatch(fetchBooks(filters));
  }, [dispatch, filters]);

  const handleCategoryChange = (category) => {
    // Convert 'all' back to empty string for the filter
    const categoryValue = category === 'all' ? '' : category;
    dispatch(setFilters({
      category: categoryValue,
      page: 1
    }));
  };

  const handleAuthorChange = (author) => {
    const authorValue = author === 'All Authors' ? '' : author;
    dispatch(setFilters({ author: authorValue, page: 1 }));
    setAuthorInput(authorValue);
  };

  const handleSortChange = (sort) => {
    dispatch(setFilters({ sort, page: 1 }));
  };

  const handleOrderChange = () => {
    dispatch(setFilters({
      order: filters.order === 'asc' ? 'desc' : 'asc',
      page: 1
    }));
  };

  const handleLimitChange = (limit) => {
    dispatch(setFilters({ limit: parseInt(limit), page: 1 }));
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ page }));
  };

  const handleRefresh = () => {
    dispatch(fetchBooks(filters));
  };

  const handlePreview = (book) => {
    // console.log('Preview book:', book);
    // Implement preview logic
  };

  const handlePurchase = (book) => {
    // console.log('Purchase book:', book);
    // Implement purchase logic
  };

  // Fix the selectedCategory logic to handle the conversion
  const selectedCategory = CATEGORIES.find(cat => {
    if (filters.category === '' || !filters.category) {
      return cat.value === 'all';
    }
    return cat.value === filters.category;
  }) || CATEGORIES[0];

  const selectedAuthor = filters.author || 'All Authors';

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
                <span className="leading-tight">Educational Store</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Explore our curated collection of study materials and resources
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
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Books</p>
                  <p className="text-lg sm:text-xl font-bold">{meta?.totalItems || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Free Resources</p>
                  <p className="text-lg sm:text-xl font-bold">{books.filter(b => b.isFree).length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Categories</p>
                  <p className="text-lg sm:text-xl font-bold">{CATEGORIES.length - 1}</p>
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
                  <p className="text-lg sm:text-xl font-bold">{meta?.currentPage || 1}</p>
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
                  placeholder="Search for books, notes, test series, authors..."
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
                    value={filters.category === '' || !filters.category ? 'all' : filters.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="h-9 sm:h-10">
                      <div className="flex items-center gap-2">
                        <selectedCategory.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <SelectValue placeholder="Select category" className="truncate" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Author Filter */}
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Select value={selectedAuthor} onValueChange={handleAuthorChange}>
                    <SelectTrigger className="h-9 sm:h-10">
                      <SelectValue placeholder="Select author" className="truncate" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTHORS.map((author) => (
                        <SelectItem key={author} value={author}>
                          <span className="truncate">{author}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort by</label>
                  <Select value={filters.sort} onValueChange={handleSortChange}>
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
                    title={`Sort ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
                  >
                    {filters.order === 'asc' ?
                      <SortAsc className="h-3 w-3 sm:h-4 sm:w-4" /> :
                      <SortDesc className="h-3 w-3 sm:h-4 sm:w-4" />
                    }
                  </Button>

                  <Select value={filters.limit.toString()} onValueChange={handleLimitChange}>
                    <SelectTrigger className="w-16 sm:w-20 h-9 sm:h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="36">36</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                {filters.category && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">{selectedCategory.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-transparent"
                      onClick={() => handleCategoryChange('all')}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {filters.author && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">{filters.author}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-transparent"
                      onClick={() => handleAuthorChange('All Authors')}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {filters.search && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">"{filters.search}"</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-transparent"
                      onClick={() => {
                        setSearchInput('');
                        dispatch(setFilters({ search: '', page: 1 }));
                      }}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>

              {/* Results Info */}
              {meta && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t gap-2">
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>
                      Showing <strong>{books.length}</strong> of <strong>{meta.totalItems}</strong> results
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Page <strong>{meta.currentPage}</strong> of <strong>{meta.totalPages}</strong>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Books Grid */}
        <div className={`grid gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 ${viewMode === 'grid'
          ? 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
          }`}>
          {loading
            ? Array.from({ length: filters.limit || 12 }).map((_, i) => (
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
            : books.length > 0 ? (
              books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onPreview={handlePreview}
                  onPurchase={handlePurchase}
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
                    <h3 className="text-xl sm:text-2xl font-bold">No books found</h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                      We couldn't find any books matching your search criteria.
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchInput('');
                      dispatch(setFilters({
                        search: '',
                        category: '',
                        author: '',
                        page: 1
                      }));
                    }}
                    className="text-sm"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
        </div>
        {/* Book Combos Section */}
        <Card className="mb-6 sm:mb-8 border-2 border-yellow-200/50">
          <CardContent className="p-4 sm:p-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-lg">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                    Book Combos
                  </h2>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 border-yellow-300">
                    Special Offers
                  </Badge>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Save more with our curated book combinations and exclusive deals
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Best Value</span>
                </div>
              </div>
            </div>

            {/* Combo Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-3 sm:p-4 border border-yellow-200/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Available Combos</p>
                    <p className="text-lg sm:text-xl font-bold text-yellow-700 dark:text-yellow-400">{combos.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 sm:p-4 border border-green-200/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg. Savings</p>
                    <p className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-400">{(totalAvgSavings) / combos.length}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 sm:p-4 border border-blue-200/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Free Combos</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-400">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 sm:p-4 border border-purple-200/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Top Rated</p>
                    <p className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-400">N/A</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Combo Cards Container */}
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/50 via-transparent to-yellow-50/50 dark:from-yellow-900/10 dark:via-transparent dark:to-yellow-900/10 rounded-lg"></div>

              {/* BookComboCard Component */}
              <div className="relative">
                <BookComboCard />
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-6 sm:mt-8 text-center">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 sm:p-6 border border-yellow-200/50">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                  Can't find the perfect combination?
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Contact us to create a custom combo that fits your learning needs
                </p>
                <Button
                  variant="outline"
                  className="border-yellow-300 hover:bg-yellow-50 hover:border-yellow-400 dark:hover:bg-yellow-900/20"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Request Custom Combo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex justify-center items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  disabled={!meta.hasPrevPage}
                  onClick={() => handlePageChange(meta.currentPage - 1)}
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>

                <div className="flex gap-1 overflow-x-auto">
                  {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(
                      meta.totalPages - 4,
                      Math.max(1, meta.currentPage - 2)
                    )) + i;

                    if (pageNum > meta.totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === meta.currentPage ? "default" : "outline"}
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
                  disabled={!meta.hasNextPage}
                  onClick={() => handlePageChange(meta.currentPage + 1)}
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