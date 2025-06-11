import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, AlertCircle, ThumbsUp, User, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const CourseRatingReviews = ({ courseId, user, isLoggedIn }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  // Fetch reviews and rating statistics
  const isEnrolled = (courseId) => {
    return isLoggedIn && user && user._id && user.courses?.length
      ? user.courses.some((course) => course._id.toString() === courseId.toString())
      : false;
  };

  useEffect(() => {
    const fetchReviewsAndStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all reviews for this course
        const reviewsResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/courses/getReviews?courseId=${courseId}`,
          {
            credentials: 'include'
          }
        );

        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const reviewsData = await reviewsResponse.json();

        // Filter reviews for current course and sort by date
        const courseReviews = reviewsData.data
          .filter(review => review.course._id === courseId)
          .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
        setReviews(courseReviews);
        setTotalReviews(courseReviews.length);

        // Check if current user has already reviewed - FIXED
        if (isLoggedIn && user && user._id) {
          const userReview = courseReviews.find(review => review.user._id === user._id);
          setHasUserReviewed(!!userReview);
        }

        // Calculate average rating and distribution
        if (courseReviews.length > 0) {
          const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / courseReviews.length;
          setAverageRating(Math.round(avgRating * 10) / 10);

          // Calculate rating distribution
          const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          courseReviews.forEach(review => {
            distribution[review.rating]++;
          });
          setRatingDistribution(distribution);
        } else {
          setAverageRating(0);
          setRatingDistribution({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        }

      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchReviewsAndStats();
    }
  }, [courseId, user?._id, isLoggedIn]);

  const renderStars = (rating, interactive = false, size = 'sm') => {
    const stars = [];
    const starSize = size === 'lg' ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-3 h-3 sm:w-4 sm:h-4';

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${starSize} ${interactive ? 'cursor-pointer' : ''} transition-all duration-200 ${i <= (interactive ? hoveredStar || newRating : rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-muted-foreground hover:text-yellow-200'
            }`}
          onClick={interactive ? () => setNewRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoveredStar(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
        />
      );
    }
    return stars;
  };

  const renderRatingDistribution = () => {
    return (
      <div className="space-y-2 sm:space-y-3">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = ratingDistribution[rating];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-1 w-10 sm:w-14">
                <span className="text-xs sm:text-sm font-medium">{rating}</span>
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 bg-muted rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <Badge variant="outline" className="text-xs w-6 sm:w-8 justify-center py-0.5 sm:py-1">
                {count}
              </Badge>
            </div>
          );
        })}
      </div>
    );
  };

  const handleSubmitReview = async () => {
    if (!newRating || !newReview.trim()) {
      setError('Please provide both rating and review.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/courses/createRating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rating: newRating,
          review: newReview.trim(),
          courseId: courseId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      // Reset form and refresh reviews
      setNewRating(0);
      setNewReview('');
      setShowAddReview(false);
      setHasUserReviewed(true);

      // Refresh the reviews list
      window.location.reload(); // Simple approach, you could also refetch data

    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <section className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Card className="shadow-lg border-0">
          <CardContent className="p-3 sm:p-6">
            <div className="animate-pulse space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="h-6 sm:h-8 bg-muted rounded w-2/3 sm:w-1/3"></div>
                <div className="h-8 sm:h-10 bg-muted rounded w-24 sm:w-32"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="h-16 sm:h-20 bg-muted rounded"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-4 sm:h-6 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 sm:h-24 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

        {/* Reviews List Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">
                      Reviews & Ratings
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {totalReviews} review{totalReviews !== 1 ? 's' : ''} • {averageRating.toFixed(1)} average rating
                    </p>
                  </div>
                </div>

                {isLoggedIn && user && user._id && isEnrolled(courseId) && !hasUserReviewed && (
                  <Button
                    onClick={() => setShowAddReview(!showAddReview)}
                    variant={showAddReview ? "secondary" : "default"}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    {showAddReview ? 'Cancel' : 'Write Review'}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              {/* Error Display */}
              {error && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 sm:gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0" />
                  <p className="text-destructive text-xs sm:text-sm">{error}</p>
                </div>
              )}

              {/* User Already Reviewed Message */}
              {isLoggedIn && user && user._id && hasUserReviewed && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 sm:gap-3">
                  <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-xs sm:text-sm">Thank you! You have already reviewed this course.</p>
                </div>
              )}

              {/* Add Review Form */}
              {showAddReview && !hasUserReviewed && (
                <Card className="mb-4 sm:mb-6 border-l-4 border-l-primary/30 bg-muted/30">
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      Share Your Experience
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Rating</label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            {renderStars(newRating, true, 'lg')}
                          </div>
                          {newRating > 0 && (
                            <Badge variant="secondary" className="w-fit">
                              {newRating} star{newRating !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Your Review</label>
                        <textarea
                          value={newReview}
                          onChange={(e) => setNewReview(e.target.value)}
                          placeholder="Share your thoughts about this course..."
                          className="w-full min-h-[80px] sm:min-h-[100px] p-2 sm:p-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
                          maxLength={1000}
                          required
                        />
                        <div className="text-right text-xs text-muted-foreground mt-1">
                          {newReview.length}/1000 characters
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                        <Button
                          onClick={handleSubmitReview}
                          disabled={!newRating || !newReview.trim() || isSubmitting}
                          className="w-full sm:w-auto"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddReview(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews List */}
              <div className="space-y-3 sm:space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                      <p className="text-muted-foreground font-medium text-sm sm:text-base">No reviews yet</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">Be the first to share your experience!</p>
                    </div>
                  </div>
                ) : (
                  reviews.map((review, index) => (
                    <Card
                      key={review._id}
                      className="hover:bg-muted/30 transition-colors border-l-4 border-l-primary/30"
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs sm:text-sm overflow-hidden flex-shrink-0">
                            {review.user.image ? (
                              <img
                                src={review.user.image}
                                alt={`${review.user.firstName} ${review.user.lastName}`}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                          </div>

                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                <h4 className="font-semibold text-sm sm:text-base truncate">
                                  {review.user.firstName} {review.user.lastName}
                                </h4>
                                <Badge variant="secondary" className="px-2 py-1 w-fit">
                                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  {review.rating}/5
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span className="hidden sm:inline">{formatDate(review.createdAt)}</span>
                                <span className="sm:hidden">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>

                            <p className="text-sm leading-relaxed text-muted-foreground break-words">
                              {review.review}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Statistics Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="shadow-lg border-0 lg:sticky lg:top-4">
            <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-secondary/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold">
                    Rating Overview
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Course rating statistics
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
              {/* Average Rating Display */}
              <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(Math.round(averageRating), false, 'lg')}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </p>
              </div>

              <Separator />

              {/* Rating Distribution */}
              <div>
                <h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">Rating Distribution</h3>
                {renderRatingDistribution()}
              </div>

              {/* View All Reviews Dialog */}
              {reviews.length > 3 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View All Reviews
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] sm:max-h-[80vh] mx-4">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg sm:text-xl">All Course Reviews</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm">
                        Complete list of all {totalReviews} review{totalReviews !== 1 ? 's' : ''} for this course
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <ScrollArea className="max-h-60 sm:max-h-96">
                      <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">
                        {reviews.map((review) => (
                          <div key={review._id} className="p-3 sm:p-4 border rounded-lg">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs flex-shrink-0">
                                {review.user.image ? (
                                  <img
                                    src={review.user.image}
                                    alt={`${review.user.firstName} ${review.user.lastName}`}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  getInitials(review.user.firstName, review.user.lastName)
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                                  <h4 className="font-medium text-sm truncate">
                                    {review.user.firstName} {review.user.lastName}
                                  </h4>
                                  <div className="flex items-center gap-1">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {formatDate(review.createdAt)}
                                </p>
                                <p className="text-xs sm:text-sm break-words">{review.review}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <AlertDialogFooter>
                      <AlertDialogAction>Close</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CourseRatingReviews;