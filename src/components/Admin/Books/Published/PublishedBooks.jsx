import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, setFilters } from '@/redux/api/booksSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Search,
  SortAsc,
  SortDesc,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Clock,
  Menu,
  X,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Download,
  BarChart3,
  Users,
  DollarSign,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

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
  { value: 'purchases', label: 'Most Popular', icon: TrendingUp },
  { value: 'revenue', label: 'Revenue', icon: DollarSign }
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' }
];

// Admin Book Card Component
const AdminBookCard = ({ book, onEdit, onDelete, onToggleStatus, onViewAnalytics, viewMode }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };
  console.log(book)
  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Book Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-28 sm:w-24 sm:h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                {book.thumbnailUrl ? (
                  <img src={book.thumbnailUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="h-8 w-8 text-blue-600" />
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-semibold text-lg leading-tight truncate">{book.title}</h3>
                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(book.status)}`}>
                      {book.status || 'Published'}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 truncate">
                    by {book.author} • {book.category}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <p className="font-medium">{book.isFree ? 'Free' : formatCurrency(book.price)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sales:</span>
                      <p className="font-medium">{book.totalSales || 0}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <p className="font-medium">{formatCurrency(book.totalRevenue)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating:</span>
                      <p className="font-medium">{book.averageRating || 'N/A'} ⭐</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewAnalytics(book)}
                    className="gap-1"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(book)}
                    className="gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleStatus(book)}
                    className="gap-1"
                  >
                    {book.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {book.status === 'published' ? 'Hide' : 'Show'}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Book</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{book.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(book)} className="bg-red-600 hover:bg-red-700">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
          {book.thumbnailUrl ? (
            <img src={book.thumbnailUrl} alt={book.title} className="w-full h-full object-contain" />
          ) : (
            <BookOpen className="h-12 w-12 text-blue-600" />
          )}
        </div>

        <Badge className={`absolute top-2 right-2 text-xs ${getStatusColor(book.status)}`}>
          {book.status || 'Published'}
        </Badge>

        {book.isFree && (
          <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs">
            FREE
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              by {book.author}
            </p>
            <p className="text-xs text-muted-foreground">
              {book.category}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground block">Price</span>
              <span className="font-medium">{book.isFree ? 'Free' : formatCurrency(book.price)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Sales</span>
              <span className="font-medium">{book.totalSales || 0}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(book)}
                className="flex-1 gap-1"
              >
                <Edit className="h-3 w-3" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewAnalytics(book)}
                className="px-2"
              >
                <BarChart3 className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(book)}
                className="flex-1 gap-1"
              >
                {book.status === 'published' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {book.status === 'published' ? 'Hide' : 'Show'}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2 text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Book</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{book.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(book)} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function PublishedBooks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, loading, filters, meta } = useSelector((state) => state.books);

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);

  console.log(books)

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        dispatch(setFilters({ search: searchInput, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch, filters.search]);

  // Fetch books when filters change
  useEffect(() => {
    dispatch(fetchBooks({ ...filters, adminView: true }));
  }, [dispatch, filters]);

  const handleCategoryChange = (category) => {
    const categoryValue = category === 'all' ? '' : category;
    dispatch(setFilters({ category: categoryValue, page: 1 }));
  };

  const handleAuthorChange = (author) => {
    const authorValue = author === 'All Authors' ? '' : author;
    dispatch(setFilters({ author: authorValue, page: 1 }));
  };

  const handleStatusChange = (status) => {
    const statusValue = status === 'all' ? '' : status;
    dispatch(setFilters({ status: statusValue, page: 1 }));
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
    dispatch(fetchBooks({ ...filters, adminView: true }));
  };

  const handleEdit = (book) => {
    console.log('Edit book:', book);
    // Navigate to edit page or open edit modal
    // Example: navigate(`/admin/books/edit/${book._id}`);
  };

  const handleDelete = async (book) => {
    try {
      const deleteResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/store/deleteBook`, {
        id: book._id
      }, {
        withCredentials: true
      });

      console.log(deleteResponse)
      if (deleteResponse.status === 200) {
        toast.success(`${book.title} deleted`)
        dispatch(fetchBooks({ ...filters, adminView: true }));
      } else {
        toast.error("Something Went Wrong")
      }
    } catch (error) {
      toast.error('Something went wrong, try again after some time')

      console.log(error)
    }
  };

  const handleToggleStatus = (book) => {
    console.log('Toggle status:', book);
    const newStatus = book.status === 'published' ? 'draft' : 'published';
    //TODO: logic for toggle status
  };

  const handleViewAnalytics = (book) => {
    console.log('View analytics:', book);
    // Navigate to analytics page
    // Example: navigate(`/admin/books/analytics/${book._id}`);
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action, selectedBooks);
    // Implement bulk actions
  };

  const handleExport = () => {
    console.log('Export books data');
    // Implement export functionality
  };

  const selectedCategory = CATEGORIES.find(cat => {
    if (filters.category === '' || !filters.category) {
      return cat.value === 'all';
    }
    return cat.value === filters.category;
  }) || CATEGORIES[0];

  const selectedAuthor = filters.author || 'All Authors';
  const selectedStatus = filters.status || 'all';

  // Calculate stats
  const stats = {
    totalBooks: meta?.totalItems || 0,
    publishedBooks: books.filter(b => b.status === 'published').length,
    draftBooks: books.filter(b => b.status === 'draft').length,
    totalRevenue: books.reduce((sum, book) => sum + (book.totalRevenue || 0), 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span className="leading-tight">Published Books</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Manage your educational content and track performance
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>

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

              <Button
                size="sm"
                onClick={() => navigate('/admin/books/published/createcombo')}
                className="gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                Create Combo
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

          {/* Admin Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Books</p>
                  <p className="text-lg sm:text-xl font-bold">{stats.totalBooks}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Published</p>
                  <p className="text-lg sm:text-xl font-bold">{stats.publishedBooks}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Drafts</p>
                  <p className="text-lg sm:text-xl font-bold">{stats.draftBooks}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Revenue</p>
                  <p className="text-lg sm:text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
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
                  placeholder="Search books, authors, categories..."
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4 items-end">
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

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger className="h-9 sm:h-10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_FILTERS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <span className="truncate">{status.label}</span>
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
                {filters.status && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">
                      {STATUS_FILTERS.find(s => s.value === filters.status)?.label}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-transparent"
                      onClick={() => handleStatusChange('all')}
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

              {/* Bulk Actions */}
              {selectedBooks.length > 0 && (
                <div className="flex items-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    {selectedBooks.length} book{selectedBooks.length > 1 ? 's' : ''} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('publish')}
                    className="gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('draft')}
                    className="gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBooks([])}
                  >
                    Clear
                  </Button>
                </div>
              )}

              {/* Results Info */}
              {meta && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t gap-2">
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>
                      Showing <strong>{books.length}</strong> of <strong>{meta.totalItems}</strong> books
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

        {/* Books Grid/List */}
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
                <AdminBookCard
                  key={book._id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  onViewAnalytics={handleViewAnalytics}
                  viewMode={viewMode}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 sm:py-16 px-4">
                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                  <div className="rounded-full bg-muted p-4 sm:p-6">
                    <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold">No books found</h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                      No books match your current filters. Try adjusting your search criteria or create a new book.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchInput('');
                        dispatch(setFilters({
                          search: '',
                          category: '',
                          author: '',
                          status: '',
                          page: 1
                        }));
                      }}
                      className="text-sm"
                    >
                      Clear all filters
                    </Button>
                    <Button
                      onClick={() => console.log('Add new book')}
                      className="text-sm gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Book
                    </Button>
                  </div>
                </div>
              </div>
            )}
        </div>

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

        {/* Quick Actions Panel */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
                onClick={() => console.log('View analytics dashboard')}
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Analytics</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
                onClick={() => console.log('Manage categories')}
              >
                <Grid3X3 className="h-6 w-6" />
                <span className="text-sm">Categories</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
                onClick={() => console.log('View users')}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Users</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
                onClick={() => console.log('Export all data')}
              >
                <Download className="h-6 w-6" />
                <span className="text-sm">Export All</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PublishedBooks;