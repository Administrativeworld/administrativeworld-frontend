import CourseCard from '@/components/Courses/CourseCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';
import {
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Award,
  Users,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function TopRatedCourses({ metaData }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchTopRatedCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/courses/getTopRatedCourses?num=8`
        );
        setCourses(response.data.data || []);
      } catch (error) {
        console.error('Error fetching top rated courses:', error);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedCourses();
  }, []);

  // Dynamic scroll amount based on screen size - Fixed for very small screens
  const getScrollAmount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 400) return window.innerWidth - 24; // Very small screens with padding
      if (window.innerWidth < 640) return 280; // Mobile
      if (window.innerWidth < 768) return 320; // Small tablet
      if (window.innerWidth < 1024) return 360; // Tablet
      return 400; // Desktop
    }
    return 280;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      setCurrentSlide(Math.max(0, currentSlide - 1));
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      const maxSlides = Math.ceil((courses.length + 1) / getItemsPerView());
      setCurrentSlide(Math.min(maxSlides - 1, currentSlide + 1));
    }
  };

  // Fixed items per view for very small screens
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 400) return 1; // Very small screens
      if (window.innerWidth < 640) return 1; // Mobile
      if (window.innerWidth < 768) return 1.5; // Small tablet
      if (window.innerWidth < 1024) return 3; // Tablet
      if (window.innerWidth < 1280) return 2.5; // Small desktop
      return 3; // Large desktop
    }
    return 1;
  };

  // Handle scroll to update current slide indicator
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const scrollAmount = getScrollAmount();
      const newSlide = Math.round(scrollLeft / scrollAmount);
      setCurrentSlide(newSlide);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Get dynamic card width based on screen size
  const getCardWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 400) return 'calc(100vw - 3rem)'; // Very small screens
      if (window.innerWidth < 640) return '16rem'; // Mobile - 256px
      if (window.innerWidth < 768) return '18rem'; // Small tablet - 288px
      if (window.innerWidth < 1024) return '20rem'; // Tablet - 320px
      return '24rem'; // Desktop - 384px
    }
    return '16rem';
  };

  if (error) {
    return (
      <Card className="mx-2 sm:mx-4 lg:mx-6 xl:mx-8">
        <CardContent className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
          <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-full w-fit mx-auto">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">Unable to load courses</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8">
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
                  Top Rated Courses
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-0.5 sm:mt-1">
                  Discover our highest-rated educational content
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Hidden on mobile, visible on tablet+ */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              className="h-8 w-8 md:h-9 md:w-9 p-0 shrink-0"
              disabled={loading || currentSlide === 0}
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollRight}
              className="h-8 w-8 md:h-9 md:w-9 p-0 shrink-0"
              disabled={loading || currentSlide >= Math.ceil((courses.length + 1) / getItemsPerView()) - 1}
            >
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Banner */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            <Card className="p-2 sm:p-3 md:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <div className="p-1 sm:p-1.5 md:p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex-shrink-0">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Avg Rating
                  </p>
                  <p className="text-sm sm:text-lg md:text-xl font-bold">
                    {courses.length > 0
                      ? (courses.reduce((acc, course) => acc + (course.rating || 4.5), 0) / courses.length).toFixed(1)
                      : '4.8'
                    }
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-2 sm:p-3 md:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <div className="p-1 sm:p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Total Students
                  </p>
                  <p className="text-sm sm:text-lg md:text-xl font-bold">
                    {metaData ? metaData.totalEnrolledMaterials : 'N/A'}+
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-2 sm:p-3 md:p-4 col-span-1 xs:col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <div className="p-1 sm:p-1.5 md:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Featured Courses
                  </p>
                  <p className="text-sm sm:text-lg md:text-xl font-bold">{metaData ? metaData.totalCourses : 'N/A'}+</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Courses Container */}
        <div className="relative">
          {loading ? (
            /* Loading Skeletons - Responsive Grid for Loading */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full">
                  <Card className="overflow-hidden">
                    <Skeleton className="h-32 sm:h-40 md:h-48 w-full" />
                    <CardContent className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
                        <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                      </div>
                      <Skeleton className="h-5 sm:h-6 w-full" />
                      <Skeleton className="h-3 sm:h-4 w-3/4" />
                      <div className="flex items-center justify-between pt-1 sm:pt-2">
                        <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" />
                        <Skeleton className="h-7 sm:h-8 w-16 sm:w-20" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <>
              {/* Conditional Layout: Vertical for very small screens, Horizontal for larger */}
              <div className="block xs:hidden">
                {/* Vertical Layout for very small screens (< 400px) */}
                <div className="space-y-3">
                  {courses.slice(0, 3).map((course, index) => (
                    <div key={course._id} className="w-full">
                      <div className="relative">
                        {/* Top Rated Badge */}
                        {index < 3 && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg text-xs px-1.5 py-0.5">
                              <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                              #{index + 1} Rated
                            </Badge>
                          </div>
                        )}
                        <CourseCard
                          course={course}
                          ButtonName="View Course"
                          className="h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                        />
                      </div>
                    </div>
                  ))}

                  {/* View All Card for mobile */}
                  <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[120px] space-y-2">
                      <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                        <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold">View All Courses</h3>
                        <p className="text-xs text-muted-foreground">
                          Explore our complete collection
                        </p>
                      </div>
                      <Button
                        className="mt-2 text-xs px-3 py-1.5"
                        onClick={() => navigate("/home/explore")}
                      >
                        Browse All
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Horizontal Layout for larger screens (>= 400px) */}
              <div className="hidden xs:block ">
                <div
                  ref={scrollContainerRef}
                  className="flex gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-4 snap-x snap-mandatory scroll-smooth"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitScrollbar: { display: 'none' }
                  }}
                >
                  {courses.map((course, index) => (
                    <div
                      key={course._id}
                      className="mx-2  snap-start mobile-card"
                      style={{
                        width: getCardWidth(),
                        minWidth: 'unset'
                      }}
                    >
                      {/* Rest of your card content remains the same */}
                      <div className="relative">
                        {/* Top Rated Badge for first few courses */}
                        {index < 3 && (
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                            <Badge
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1"
                            >
                              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 fill-current" />
                              #{index + 1} Rated
                            </Badge>
                          </div>
                        )}

                        <CourseCard
                          course={course}
                          ButtonName="View Course"
                          className="h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                        />
                      </div>
                    </div>
                  ))}

                  {/* View All Card */}
                  <div
                    className="flex-shrink-0 snap-start mobile-card"
                    style={{
                      width: getCardWidth(),
                      minWidth: 'unset'
                    }}
                  >
                    <Card className="h-full border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px] space-y-2 sm:space-y-3 md:space-y-4">
                        <div className="p-2 sm:p-3 md:p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                          <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold">View All Courses</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Explore our complete collection of educational content
                          </p>
                        </div>
                        <Button
                          className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1.5 sm:py-2"
                          onClick={() => navigate("/home/explore")}
                        >
                          Browse All
                          <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Mobile Navigation Buttons - Only for horizontal layout */}
                <div className="flex md:hidden justify-center mt-3 sm:mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollLeft}
                    className="h-8 w-8 p-0"
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollRight}
                    className="h-8 w-8 p-0"
                    disabled={currentSlide >= Math.ceil((courses.length + 1) / getItemsPerView()) - 1}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>

                {/* Pagination Dots - Only for horizontal layout */}
                <div className="flex justify-center mt-3 sm:mt-4 md:mt-6 gap-1 sm:gap-2">
                  {Array.from({ length: Math.ceil((courses.length + 1) / getItemsPerView()) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          const scrollAmount = getScrollAmount();
                          scrollContainerRef.current.scrollTo({
                            left: i * scrollAmount,
                            behavior: 'smooth'
                          });
                          setCurrentSlide(i);
                        }
                      }}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${currentSlide === i
                        ? 'bg-primary scale-125'
                        : 'bg-muted hover:bg-muted-foreground/30'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <Card>
              <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12 text-center space-y-3 sm:space-y-4 md:space-y-6">
                <div className="p-2 sm:p-3 md:p-4 bg-muted rounded-full w-fit mx-auto">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">No courses available</h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                    We're working on bringing you the best educational content.
                    Check back soon for top-rated courses!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Enhanced Custom CSS for hiding scrollbar and responsive design */}
      <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          /* Very small devices (phones below 400px) - Use xs breakpoint */
          @media (max-width: 399px) {          
            .container {
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }
            
            /* Smaller text on very small screens */
            .text-lg {
              font-size: 1rem;
              line-height: 1.5rem;
            }
            
            .text-xl {
              font-size: 1.125rem;
              line-height: 1.75rem;
            }
            
            /* Ensure proper spacing for vertical layout */
            .space-y-3 > * + * {
              margin-top: 0.75rem;
            }
          }
          
          /* Define xs breakpoint for 400px+ */
          @media (min-width: 400px) {
            .xs\\:block {
              display: block;
            }
            .xs\\:hidden {
              display: none;
            }
          }
          
          /* Extra small devices (phones, 320px to 479px) */
          @media (max-width: 479px) {
            .container {
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }
          }
          
          /* Small devices (landscape phones, 480px and up) */
          @media (min-width: 480px) and (max-width: 639px) {
            .xs\\:w-72 {
              width: 18rem;
            }
            .xs\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .xs\\:col-span-2 {
              grid-column: span 2 / span 2;
            }
          }
          
          /* Ensure smooth scrolling performance */
          .scroll-smooth {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Better touch scrolling on mobile */
          @media (max-width: 767px) {
            .scrollbar-hide {
              scroll-snap-type: x mandatory;
              scroll-padding: 0.75rem;
            }
            
            /* Optimize scroll performance on mobile */
            .snap-start {
              scroll-snap-align: start;
            }
          }
          
          /* High DPI displays */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .group:hover .group-hover\\:translate-x-1 {
              transform: translateX(0.125rem);
            }
          }
          
          /* Prevent horizontal overflow on very small screens */
          @media (max-width: 399px) {
            body {
              overflow-x: hidden;
            }
            
            .section {
              overflow-x: hidden;
            }
          }
          
          /* Responsive card heights */
          @media (max-width: 399px) {
            .min-h-\\[200px\\] {
              min-height: 180px;
            }
          }
          
          @media (min-width: 400px) and (max-width: 639px) {
            .min-h-\\[200px\\] {
              min-height: 200px;
            }
          }
        `}</style>
    </section>
  );
}

TopRatedCourses.propTypes = {
  metaData: PropTypes.shape({
    totalRegisteredStudent: PropTypes.number,
    totalCourses: PropTypes.number,
    totalStudyMaterial: PropTypes.number,
    totalEnrolledMaterials: PropTypes.number,
    totalStoreItems: PropTypes.number,
    breakdown: PropTypes.shape({
      coursePurchases: PropTypes.number,
      storePurchases: PropTypes.number,
    }),
  }).isRequired,
};


export default TopRatedCourses;