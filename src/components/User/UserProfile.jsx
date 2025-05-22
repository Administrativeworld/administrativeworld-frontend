import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Mail, Calendar, BookOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchEnrolledCourses } from "@/redux/api/fetchEnrolledCourses";
import EnrolledCourseCard from "./EnrolledCourseCard";
import EditProfileDialog from "./EditProfileDialog";
import { setProfileEditDialog } from "@/redux/global/GlobalVar"; // Import the action
import Logout from "./Logout"; // Import the Logout component

export default function UserProfile() {
  const { user } = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const { enrolledCourses } = useSelector((state) => state.enrolledCourses);
  const { profileEditDialog } = useSelector((state) => state.globalVar); // Get profileEditDialog state

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
  }, [dispatch]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Section */}
        <Card className="overflow-hidden bg-white/10 backdrop-blur-sm">
          <div className="md:flex">
            {/* Left Column - Profile Info */}
            <div className="md:w-1/3 p-6 md:border-r border-gray-100">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={user.image || ""} alt={user.firstName} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 ">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-2xl font-bold ">
                  {user.firstName} {user.lastName}
                </h2>
                <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm bg-blue-100 text-blue-800">
                  {user.accountType}
                </span>
              </div>
            </div>

            {/* Right Column - Details & Stats */}
            <div className="md:w-2/3 p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 ">
                  <Mail className="w-5 h-5" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 ">
                  <Calendar className="w-5 h-5" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3 ">
                  <BookOpen className="w-5 h-5" />
                  <span>{enrolledCourses?.length || 0} Courses Enrolled</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  // 
                  className="w-full sm:w-auto transition-colors"
                  onClick={() => dispatch(setProfileEditDialog(true))} // Dispatch action to open dialog
                >
                  <Pencil className="" />
                  Edit Profile
                </Button>
                <Logout /> {/* Added the Logout component here */}
              </div>
            </div>
          </div>
        </Card>

        {/* Enrolled Courses Section */}
        <Card className="bg-white/10 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Enrolled Courses
              </CardTitle>
              <span className="text-sm ">
                {enrolledCourses?.length || 0} courses
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-start flex-wrap gap-6">
              {enrolledCourses?.map((course) => (
                <EnrolledCourseCard
                  key={course._id}
                  course={course}
                  ButtonName="Continue Learning"
                />
              ))}
            </div>
            {enrolledCourses?.length === 0 && (
              <div className="text-center py-12 ">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No courses enrolled yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pass the open state from Redux to the EditProfileDialog */}
        <EditProfileDialog user={user} open={profileEditDialog} setOpen={(open) => dispatch(setProfileEditDialog(open))} />
      </div>
    </div>
  );
}