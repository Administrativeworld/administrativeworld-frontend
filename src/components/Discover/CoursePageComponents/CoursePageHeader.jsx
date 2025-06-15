import PropTypes from "prop-types";
import { CalendarDays, Clock, Award, Star, BarChart3, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { useCallback } from "react";

function CoursePageHeader({ courseName, courseDes, thumbnail, category, avgRating = 0 }) {
  const courseStats = [
    { icon: Clock, label: "Duration", value: "8 weeks", color: "text-yellow-500" },
    { icon: CalendarDays, label: "Schedule", value: "Self-paced", color: "text-blue-500" },
    { icon: Award, label: "Certification", value: "Certificate", color: "text-green-500" },
  ];
  const formatDescription = useCallback((text) => {
    if (!text) return "";
    return text.split("\n").map((line, i) => (
      <p key={i} className={i > 0 ? "mt-2" : ""}>
        {line}
      </p>
    ));
  }, []);
  return (
    <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${thumbnail})` }}
        role="img"
        aria-label="Course background image"
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      {/* Category Badge */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <Badge variant="secondary" className="shadow-lg text-xs sm:text-sm">
          <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">{category}</span>
          <span className="xs:hidden">{category.slice(0, 8)}{category.length > 8 ? '...' : ''}</span>
        </Badge>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {/* Header Content */}
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
              {courseName}
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
              {formatDescription(courseDes.slice(0, 250))}
            </p>

            {/* Course Details Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 sm:mt-4 text-xs sm:text-sm">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Course Details
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader className="space-y-3">
                  <AlertDialogTitle className="text-left text-lg sm:text-xl font-semibold">
                    Course Information
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="text-left space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground text-base mb-2">
                          {courseName}
                        </h4>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {formatDescription(courseDes)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Category:</span>
                        <Badge variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      </div>

                      {avgRating > 0 && (
                        <div className="flex items-center gap-2 pt-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                className={`w-4 h-4 ${index < Math.floor(avgRating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {avgRating.toFixed(1)} out of 5
                          </span>
                        </div>
                      )}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6">
                  <AlertDialogAction className="w-full sm:w-auto">
                    Got it
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Course Stats */}
          <Card className="backdrop-blur-md bg-background/80 border shadow-lg mx-2 sm:mx-0">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {courseStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-center sm:justify-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-muted rounded-full flex-shrink-0">
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                      </div>
                      <div className="text-center sm:text-center">
                        <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                        <p className="font-semibold text-sm sm:text-base">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rating Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${index < Math.floor(avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-medium text-center">
                  {avgRating.toFixed(1)} out of 5 stars
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

CoursePageHeader.propTypes = {
  courseName: PropTypes.string.isRequired,
  courseDes: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  avgRating: PropTypes.number,
};

export default CoursePageHeader;