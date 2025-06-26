import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Calendar, User, Clock, Share2, Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./ReadArticle.css";

function ReadArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/article/getArticleBySlug/?slug=${slug}`
        );
        console.log(res.data.article[0]);
        const articleData = res.data.article[0];
        setArticle(articleData);

        // Calculate reading time (average 200 words per minute)
        if (articleData.content) {
          const wordCount = articleData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
          setReadingTime(Math.ceil(wordCount / 200));
        }
      } catch (err) {
        setError("Failed to load article");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Add your bookmark API call here
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // Add your like API call here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Article Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "The article you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  const author = article.author || {};
  const authorInitials = `${author.firstName?.[0] || ''}${author.lastName?.[0] || ''}`.toUpperCase();

  return (
    <>
      <Helmet>
        <title>{article.title}</title>
        <meta name="description" content={article.excerpt || article.title} />
        <meta name="author" content={`${author.firstName || ''} ${author.lastName || ''}`.trim()} />
        <meta name="keywords" content={article.tags?.join(', ') || ''} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || article.title} />
        <meta property="og:image" content={article.thumbnail} />
        <meta property="og:url" content={window.location.href} />
        <meta property="article:author" content={`${author.firstName || ''} ${author.lastName || ''}`.trim()} />
        <meta property="article:published_time" content={article.createdAt} />
        {article.tags && article.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt || article.title} />
        <meta name="twitter:image" content={article.thumbnail} />

        {/* Additional SEO */}
        <link rel="canonical" href={window.location.href} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <article className="article-container">
        {/* Article Header */}
        <header className="article-header">
          <div className="article-header-content">
            <h1 className="article-title">{article.title}</h1>

            {article.excerpt && (
              <p className="article-excerpt">{article.excerpt}</p>
            )}

            <div className="article-meta">
              <div className="author-info">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={author.avatar} alt={`${author.firstName} ${author.lastName}`} />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <div className="author-details">
                  <div className="author-name">
                    <User className="h-4 w-4" />
                    <span>{author.firstName} {author.lastName}</span>
                  </div>
                  <div className="article-date-time">
                    <div className="date-info">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="reading-time">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="article-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLike}
                  className={isLiked ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleBookmark}
                  className={isBookmarked ? "text-blue-500" : ""}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="article-tags">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="tag-badge">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {article.thumbnail && (
            <div className="article-thumbnail-container">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="article-thumbnail"
              />
            </div>
          )}
        </header>

        <Separator className="my-8" />

        {/* Article Content */}
        <div className="article-content-wrapper">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Article Footer */}
        <footer className="article-footer">
          <Separator className="mb-6" />

          {article.tags && article.tags.length > 0 && (
            <div className="footer-tags">
              <h3 className="tags-title">Tags</h3>
              <div className="tags-list">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="footer-tag">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="article-actions-footer">
            <div className="action-buttons">
              <Button
                variant={isLiked ? "default" : "outline"}
                onClick={toggleLike}
                className="action-button"
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant={isBookmarked ? "default" : "outline"}
                onClick={toggleBookmark}
                className="action-button"
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button variant="outline" onClick={handleShare} className="action-button">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}

export default ReadArticle;