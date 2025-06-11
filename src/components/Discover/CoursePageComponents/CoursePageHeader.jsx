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

function CoursePageHeader({ courseName, courseDes, thumbnail, category, avgRating = 0 }) {
  const courseStats = [
    { icon: Clock, label: "Duration", value: "8 weeks", color: "text-yellow-500" },
    { icon: CalendarDays, label: "Schedule", value: "Self-paced", color: "text-blue-500" },
    { icon: Award, label: "Certification", value: "Certificate", color: "text-green-500" },
  ];

  return (
    <section className="relative w-full min-h-[60vh] overflow-hidden">
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
      <div className="absolute top-6 right-6 z-20">
        <Badge variant="secondary" className="shadow-lg">
          <BarChart3 className="w-4 h-4 mr-2" />
          {category}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Content */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {courseName}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {courseDes}
            </p>

            {/* Course Details Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-4">
                  <Info className="w-4 h-4 mr-2" />
                  Course Details
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Course Information</AlertDialogTitle>
                  <AlertDialogDescription className="text-left">
                    <strong>{courseName}</strong>
                    <br /><br />
                    {courseDes}
                    <br /><br />
                    <strong>Category:</strong> {category}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Got it</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Course Stats */}
          <Card className="backdrop-blur-md bg-background/80 border shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courseStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="p-2 bg-muted rounded-full">
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rating Section */}
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${index < Math.floor(avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
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