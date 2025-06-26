import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  SortAsc,
  SortDesc,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  Menu,
  X,
  BookOpen,
  TrendingUp,
  Clock,
  Eye,
  Calendar,
  FileText,
  Star,
  Tag,
  Newspaper,
  Heart,
  Share2,
  ExternalLink,
  User,
  ArrowRight
} from 'lucide-react';

// API endpoints
const API_BASE = `${import.meta.env.VITE_BASE_URL}/article`;

const CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: Grid3X3 },
  { value: 'technology', label: 'Technology', icon: BookOpen },
  { value: 'education', label: 'Education', icon: FileText },
  { value: 'business', label: 'Business', icon: TrendingUp },
  { value: 'lifestyle', label: 'Lifestyle', icon: Star },
  { value: 'science', label: 'Science', icon: BookOpen }
];

const SORT_OPTIONS = [
  { value: 'publishedAt', label: 'Latest First', icon: Clock },
  { value: 'title', label: 'Title A-Z', icon: SortAsc },
  { value: 'views', label: 'Most Viewed', icon: Eye },
  { value: 'createdAt', label: 'Recently Added', icon: Calendar }
];

// Modern Article Card Component
const ModernArticleCard = ({ article, onReadMore }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views?.toString() || '0';
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return '';
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <div className="aspect-video bg-muted flex items-center justify-center">
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-center p-6">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No image</p>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1">
          {article.isFeatured && (
            <Badge className="text-xs px-2 py-1">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {article.isTrending && (
            <Badge className="text-xs px-2 py-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-1">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{article.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Content Preview */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {truncateContent(article.content)}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {article.author ?
                `${article.author.firstName?.[0] || ''}${article.author.lastName?.[0] || ''}` :
                <User className="h-4 w-4" />
              }
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">
                {article.author ?
                  `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim() || 'Anonymous' :
                  'Anonymous'
                }
              </p>
              <p>{formatDate(article.publishedAt || article.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{formatViews(article.views)}</span>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Button
          onClick={() => onReadMore(article)}
          className="w-full group/btn mt-3"
        >
          <span>Read Article</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default function ModernArticles() {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'publishedAt',
    order: 'desc',
    page: 1,
    limit: 12
  });
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    trending: 0,
    categories: 0
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  // Fetch articles when filters change
  useEffect(() => {
    fetchAllArticles();
  }, [filters]);

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [featuredRes, trendingRes] = await Promise.all([
        fetch(`${API_BASE}/featured?limit=4`),
        fetch(`${API_BASE}/trending?limit=4`)
      ]);

      if (featuredRes.ok) {
        const featuredData = await featuredRes.json();
        setFeaturedArticles(featuredData.articles || []);
      }

      if (trendingRes.ok) {
        const trendingData = await trendingRes.json();
        setTrendingArticles(trendingData.articles || []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchAllArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sort: filters.sort,
        order: filters.order,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && filters.category !== 'all' && { category: filters.category })
      });

      const response = await fetch(`${API_BASE}/getAllArticle?${params}`);

      if (response.ok) {
        const data = await response.json();
        console.log(data.data.articles)
        setArticles(data.data.articles || []);

        if (data.pagination) {
          setMeta({
            totalItems: data.pagination.totalCount || 0,
            totalPages: data.pagination.totalPages || 0,
            currentPage: data.pagination.currentPage || 1,
            hasNextPage: data.pagination.hasNextPage || false,
            hasPrevPage: data.pagination.hasPrevPage || false
          });
        }

        // Update stats
        setStats(prev => ({
          ...prev,
          total: data.pagination?.totalCount || 0,
          featured: data.articles?.filter(a => a.isFeatured).length || 0,
          trending: data.articles?.filter(a => a.isTrending).length || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: category === 'all' ? '' : category,
      page: 1
    }));
  };

  const handleSortChange = (sort) => {
    setFilters(prev => ({ ...prev, sort, page: 1 }));
  };

  const handleOrderChange = () => {
    setFilters(prev => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc',
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadMore = (article) => {
    // Navigate to full article - implement your routing logic
    window.open(`/home/articles/${article.slug}`, '_blank');
  };

  const handleRefresh = () => {
    fetchAllArticles();
    fetchInitialData();
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      category: '',
      sort: 'publishedAt',
      order: 'desc',
      page: 1,
      limit: 12
    });
  };

  const selectedCategory = CATEGORIES.find(cat =>
    filters.category === '' || !filters.category ? cat.value === 'all' : cat.value === filters.category
  ) || CATEGORIES[0];

  const LoadingSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <Newspaper className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Discover Articles
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of insightful articles, tutorials, and industry insights
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold">{featuredArticles.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Trending</p>
                <p className="text-2xl font-bold">{trendingArticles.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Tag className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{CATEGORIES.length - 1}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Featured Articles Section */}
        {featuredArticles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArticles.map(article => (
                <ModernArticleCard
                  key={`featured-${article._id}`}
                  article={article}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search articles, topics, authors..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 h-12 text-base"
              />
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
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={filters.category === '' ? 'all' : filters.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <selectedCategory.icon className="h-4 w-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort by</label>
                  <Select value={filters.sort} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleOrderChange}
                    className="flex-1"
                  >
                    {filters.order === 'asc' ?
                      <SortAsc className="h-4 w-4" /> :
                      <SortDesc className="h-4 w-4" />
                    }
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                <div className="hidden lg:flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    onClick={() => setViewMode('grid')}
                    className="flex-1"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    onClick={() => setViewMode('list')}
                    className="flex-1"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.category || filters.search) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  {filters.category && (
                    <Badge variant="secondary" className="gap-2">
                      {selectedCategory.label}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange('all')} />
                    </Badge>
                  )}
                  {filters.search && (
                    <Badge variant="secondary" className="gap-2">
                      "{filters.search}"
                      <X className="h-3 w-3 cursor-pointer" onClick={() => {
                        setSearchInput('');
                        setFilters(prev => ({ ...prev, search: '', page: 1 }));
                      }} />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear all
                  </Button>
                </div>
              )}

              {/* Results Info */}
              {meta.totalItems > 0 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-muted-foreground">
                  <span>
                    Showing {articles.length} of {meta.totalItems} articles
                  </span>
                  <span>
                    Page {meta.currentPage} of {meta.totalPages}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* All Articles Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            All Articles
          </h2>

          <div className={`grid gap-6 ${viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
            {loading
              ? Array.from({ length: filters.limit }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))
              : articles.length > 0
                ? articles.map((article) => (
                  <ModernArticleCard
                    key={article._id}
                    article={article}
                    onReadMore={handleReadMore}
                  />
                ))
                : !loading && (
                  <div className="col-span-full text-center py-16">
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">No articles found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or filters to find what you're looking for.
                      </p>
                      <Button onClick={clearAllFilters} variant="outline">
                        Clear all filters
                      </Button>
                    </div>
                  </div>
                )
            }
          </div>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={!meta.hasPrevPage}
                onClick={() => handlePageChange(meta.currentPage - 1)}
              >
                Previous
              </Button>

              <div className="flex gap-1">
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
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10 h-10 p-0"
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
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}