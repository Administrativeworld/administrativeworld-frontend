import { ScanEye, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPublishedCourses } from "@/redux/api/getPublishedCourseSlice";

function Published() {
  const dispatch = useDispatch();
  const publishedCourses = useSelector((state) => state.publishedCourses.publishedCourses.data);

  useEffect(() => {
    dispatch(getPublishedCourses());
  }, [dispatch]);

  return (
    <div>
      {(location.pathname === "/administrativeworld/admin/course/published" ||
        location.pathname === "/administrativeworld/admin/course/published/") && (
          <>
            <div className="p-2 flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  className="pl-10 py-5"
                  type="search"
                  id="search"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="p-2 flex flex-col gap-3 justify-center">
              <span className="text-xl">Published Courses</span>
              <div className="flex flex-wrap gap-3">
                {publishedCourses &&
                  publishedCourses.map((item) => (
                    <Card
                      key={item._id}
                      className="w-60 p-2 shadow-md"
                    >
                      <div className="flex p-2 justify-center">
                        <img
                          src={item.thumbnail}
                          alt={item.courseName}
                          className="w-full object-cover rounded-md"
                        />
                      </div>
                      <CardHeader className="text-sm font-medium p-2">
                        {item.courseName}
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2 p-2">
                        <div>
                          <p>{item.courseDescription.slice(0, 100)}...</p>
                        </div>
                        <div className="ml-auto">
                          <Button size="sm">View <ScanEye size={16} /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </>
        )}
    </div>
  );
}

export default Published;
