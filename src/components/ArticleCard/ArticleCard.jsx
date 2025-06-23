import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, User, Trash2, Settings, ExternalLink, Clock } from 'lucide-react';

const ArticleCard = ({ article, isAdmin, onDelete, onInspect, onReadMore }) => {
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get reading time estimate
  const getReadingTime = (content) => {
    if (!content) return '1 min';
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Truncate content for description
  const getShortDescription = (content, maxLength = 140) => {
    if (!content) return 'No description available';
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  // Get status color with enhanced styling
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'draft': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'archived': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Thumbnail - Fixed size 16:9 aspect ratio */}
          <div className="relative w-full h-48 overflow-hidden bg-muted">
            <img
              src={article.thumbnail || '/api/placeholder/400/225'}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/api/placeholder/400/225';
              }}
            />

            {/* Gradient overlay for badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {article.isFeatured && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm">
                  Featured
                </Badge>
              )}
              {article.isTrending && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm">
                  Trending
                </Badge>
              )}
            </div>

            {/* Status badge */}
            <div className="absolute top-3 right-3">
              <Badge className={`${getStatusColor(article.status)} shadow-sm`}>
                {article.status}
              </Badge>
            </div>

            {/* Reading time */}
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="bg-black/60 text-white border-0 backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                {getReadingTime(article.content)}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
              {article.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {getShortDescription(article.content)}
            </p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
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
            )}

            {/* Author and Meta Info */}
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

            {/* Action Buttons */}
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
                    Inspect
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

// Demo component to show the card in action
const ArticleCardDemo = () => {
  const sampleArticle = {
    _id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2025',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    thumbnail: '/api/placeholder/400/225',
    status: 'published',
    isFeatured: true,
    isTrending: false,
    tags: ['Web Development', 'Technology', 'Trends', 'JavaScript', 'React'],
    author: {
      firstName: 'John',
      lastName: 'Doe'
    },
    publishedAt: '2025-06-20T10:00:00Z',
    views: 1250,
    createdAt: '2025-06-18T08:00:00Z'
  };

  const handleReadMore = (article) => {
    console.log('Read more:', article.title);
  };

  const handleInspect = (article) => {
    console.log('Inspect:', article.title);
  };

  const handleDelete = (id) => {
    console.log('Delete:', id);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Enhanced ArticleCard</h2>

      <div className="space-y-4">
        <ArticleCard
          article={sampleArticle}
          isAdmin={false}
          onReadMore={handleReadMore}
        />

        <ArticleCard
          article={{
            ...sampleArticle,
            title: 'Admin View Example',
            status: 'draft',
            isFeatured: false,
            isTrending: true
          }}
          isAdmin={true}
          onInspect={handleInspect}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ArticleCardDemo;