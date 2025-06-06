import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil, Mail, Calendar, BookOpen, GraduationCap, Library, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchEnrolledCourses } from "@/redux/api/fetchEnrolledCourses";
import EnrolledCourseCard from "./EnrolledCourseCard";
import EditProfileDialog from "./EditProfileDialog";
import { setProfileEditDialog } from "@/redux/global/GlobalVar";
import Logout from "./Logout";
import BookCard from "@/components/Store/BookCard/BookCard";
import { Navigate, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user } = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enrolledCourses } = useSelector((state) => state.enrolledCourses);
  const { profileEditDialog } = useSelector((state) => state.globalVar);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
  }, [dispatch]);

  // Handler functions for BookCard
  const handlePreview = (bookId) => {
    console.log('Preview book:', bookId);
  };

  const handlePurchase = (bookId) => {
    console.log('Purchase book:', bookId);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Profile Section */}
        <Card className="overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Profile Info */}
            <div className="lg:w-1/3 p-4 sm:p-6 lg:border-r border-gray-100">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border-2 sm:border-4 border-white shadow-xl">
                  <AvatarImage src={user.image || ""} alt={user.firstName} />
                  <AvatarFallback className="text-lg sm:text-xl md:text-2xl">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <Badge variant="secondary" className="mt-2 text-xs sm:text-sm">
                  {user.accountType}
                </Badge>
              </div>
            </div>

            {/* Right Column - Details & Stats */}
            <div className="lg:w-2/3 p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{enrolledCourses?.length || 0} Courses Enrolled</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Library className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{user.materials?.length || 0} Materials Purchased</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <Button
                  onClick={() => dispatch(setProfileEditDialog(true))}
                  className="text-sm"
                  size="sm"
                >
                  <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="hidden xs:inline">Edit Profile</span>
                  <span className="xs:hidden">Edit</span>
                </Button>
                <Logout />
              </div>
            </div>
          </div>
        </Card>

        {/* Content Tabs Section */}
        <Card>
          <CardHeader className="border-b p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">My Learning & Materials</span>
              <span className="sm:hidden">Learning</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="courses" className="w-full">
              <div className="px-3 sm:px-6 pt-3 sm:pt-6">
                <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12 p-1 bg-muted rounded-md">
                  <TabsTrigger
                    value="courses"
                    className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-sm"
                  >
                    <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline truncate">
                      Courses ({enrolledCourses?.length || 0})
                    </span>
                    <span className="sm:hidden">
                      {enrolledCourses?.length || 0}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="materials"
                    className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-sm"
                  >
                    <Library className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline truncate">
                      Materials ({user.materials?.length || 0})
                    </span>
                    <span className="sm:hidden">
                      {user.materials?.length || 0}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Enrolled Courses Tab */}
              <TabsContent value="courses" className="px-3 sm:px-6 pb-3 sm:pb-6 pt-2 sm:pt-4 mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {enrolledCourses?.map((course) => (
                    <div key={course._id} className="w-full">
                      <EnrolledCourseCard
                        course={course}
                        ButtonName="Continue Learning"
                      />
                    </div>
                  ))}
                </div>
                {enrolledCourses?.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 bg-gray-50">
                      <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No courses enrolled yet</h3>
                    <p className="text-sm sm:text-base text-muted-foreground px-4">Start your learning journey by enrolling in a course</p>
                  </div>
                )}
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials" className="px-3 sm:px-6 pb-3 sm:pb-6 pt-2 sm:pt-4 mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {user.materials && user.materials.length > 0 ? (
                    user.materials.map((book) => (
                      <div key={book._id} className="w-full">
                        <BookCard
                          book={book}
                          onPreview={handlePreview}
                          onPurchase={handlePurchase}
                          className={viewMode === 'list' ? 'flex-row' : ''}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 sm:py-12">
                      <div className="rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 bg-gray-50">
                        <Library className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2">No materials purchased yet</h3>
                      <p className="text-sm sm:text-base text-muted-foreground px-4 mb-4">Browse our material store to enhance your learning</p>
                      <Button
                        className="text-sm"
                        size="sm"
                        onClick={() => navigate('/home/store')}

                      >
                        Browse Materials
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <EditProfileDialog
          user={user}
          open={profileEditDialog}
          setOpen={(open) => dispatch(setProfileEditDialog(open))}
        />
      </div>
    </div >
  );
}