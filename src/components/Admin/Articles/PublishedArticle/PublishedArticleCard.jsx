import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Search,
  Filter,
  Grid3x3,
  List,
  RefreshCw,
  AlertCircle,
  Eye,
  Calendar,
  User,
  Trash2,
  Settings,
  ExternalLink,
  Clock,
  ChevronDown
} from 'lucide-react';

// Enhanced ArticleCard Component
const ArticleCard = ({ article, isAdmin = false, onDelete, onInspect, onReadMore, viewMode = 'grid' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '1 min';
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const getShortDescription = (content, maxLength = 140) => {
    if (!content) return 'No description available';
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'draft': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'archived': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // List view for admin
  if (viewMode === 'list' && isAdmin) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={article.thumbnail || '/api/placeholder/400/225'}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/225';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {getShortDescription(article.content, 100)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={`text-xs ${getStatusColor(article.status)}`}>
                    {article.status}
                  </Badge>
                  {article.isFeatured && (
                    <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author?.firstName} {article.author?.lastName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.publishedAt || article.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views || 0}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onInspect?.(article)}
                    className="h-8 px-3"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete?.(article._id)}
                    className="h-8 px-3"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 ">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="relative w-full h-48 overflow-hidden bg-muted">
            <img
              src={article.thumbnail || '/api/placeholder/400/225'}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/api/placeholder/400/225';
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

            <div className="absolute top-3 left-3 flex gap-2">
              {article.isFeatured && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm text-xs">
                  Featured
                </Badge>
              )}
              {article.isTrending && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm text-xs">
                  Trending
                </Badge>
              )}
            </div>

            <div className="absolute top-3 right-3">
              <Badge className={`${getStatusColor(article.status)} shadow-sm text-xs`}>
                {article.status}
              </Badge>
            </div>

            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="bg-black/60 text-white border-0 backdrop-blur-sm text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {getReadingTime(article.content)}
              </Badge>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
              {article.title}
            </h3>

            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
              {getShortDescription(article.content)}
            </p>

            {/* {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted/50">
                    +{article.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )} */}

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="font-medium">
                    {article.author?.firstName} {article.author?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{article.views || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {isAdmin ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onInspect?.(article)}
                    className="flex items-center gap-1.5 flex-1"
                  >
                    <Settings className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete?.(article._id)}
                    className="flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onReadMore?.(article)}
                  className="flex items-center gap-1.5 w-full group-hover:shadow-md transition-shadow"
                >
                  <ExternalLink className="w-3 h-3" />
                  Read Article
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
function PublishedArticleCard() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/article/getAllArticleAdmin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const articlesData = data.articles || [];

      setArticles(articlesData);
      setFilteredArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...articles];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(article =>
        article.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
  }, [articles, searchTerm, statusFilter, sortBy]);

  const handleInspect = useCallback((article) => {
    console.log('Inspect article:', article);
    // Implement navigation logic here
    // For example: router.push(`/admin/articles/edit/${article._id}`);
  }, []);

  const handleDelete = useCallback(async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/article/delete/${articleId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted article from state
      setArticles(prev => prev.filter(article => article._id !== articleId));

      // Show success message (you might want to use a proper toast notification)
      alert('Article deleted successfully!');
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article. Please try again.');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-center space-y-2">
          <p className="text-red-600 font-medium">Something went wrong</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <Button onClick={fetchArticles} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Articles Management</h1>
          <p className="text-muted-foreground">
            {filteredArticles.length} of {articles.length} articles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchArticles}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="views">Most Views</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Articles Grid/List */}
      {filteredArticles.length > 0 ? (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredArticles.map(article => (
            <ArticleCard
              key={article._id}
              article={article}
              isAdmin={true}
              onInspect={handleInspect}
              onDelete={handleDelete}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-muted-foreground">No articles found</p>
            <p className="text-sm text-muted-foreground">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first article to get started'
              }
            </p>
          </div>
          {(searchTerm || statusFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default PublishedArticleCard;