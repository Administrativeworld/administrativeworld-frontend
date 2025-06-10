import PropTypes from "prop-types";
import { Bookmark, IndianRupee, Eye, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// Note: Import these in your actual implementation:
import { buyCourse } from "@/configs/capturePaymentSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function CourseDetails({ whatYouWillLearn, thumbnail, price, tags = [], courseId }) {
  // Note: Replace these with actual Redux hooks in your implementation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loggedIn } = useSelector((state) => state.authUser);



  const handleEnrollClick = () => {
    if (loggedIn) {
      buyCourse(courseId, user, navigate);
    } else {
      navigate('/login');
    }
    console.log('Enroll clicked for course:', courseId);
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Course Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Course Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <img
                  src={thumbnail}
                  alt="Course preview"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Price Card */}
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-6 h-6 text-primary" />
                      <span className="text-3xl font-bold text-primary">
                        {price}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      Best Value
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Details */}
            <div className="space-y-6">

              {/* What You'll Learn Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">What You'll Learn</h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Course Learning Outcomes</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                          <ScrollArea className="max-h-96">
                            <div className="space-y-3 text-left">
                              <p className="text-base leading-relaxed">
                                {whatYouWillLearn}
                              </p>
                              <Separator />
                              <div className="space-y-2">
                                <h4 className="font-semibold">Course Tags:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      <Bookmark className="w-3 h-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Close</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed line-clamp-3">
                      {whatYouWillLearn}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Tags Section */}
              {tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Course Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 6).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-xs hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <Bookmark className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {tags.length > 6 && (
                      <Badge variant="outline" className="px-3 py-1 text-xs">
                        +{tags.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Enrollment Button */}
              <div className="pt-4">
                <Button
                  onClick={handleEnrollClick}
                  size="lg"
                  className="w-full font-semibold text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {loggedIn ? 'Enroll Now' : 'Login to Enroll'}
                </Button>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>✓ Lifetime Access</span>
                {/* <Separator orientation="vertical" className="h-4" />
                <span>✓ Certificate Included</span>
                <Separator orientation="vertical" className="h-4" />
                <span>✓ 30-Day Refund</span> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

CourseDetails.propTypes = {
  whatYouWillLearn: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  courseId: PropTypes.string.isRequired,
};

export default CourseDetails;