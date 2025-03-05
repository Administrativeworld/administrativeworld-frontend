import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  ClipboardList,
  Tag,
  Percent,
  Upload,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearCourseState, createCourse } from "@/redux/api/createCourseSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "@/redux/api/getCategorySlice";
import PrimarySpinner from "../Loaders/PrimarySpinner";
import CoursePreview from "../Admin/CoursePreview";
import { nextStep, setCourseBuilderId } from "@/redux/api/courseBuilderSlice";
import { ArrowRight } from "@mynaui/icons-react";

function CourseInfo() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories } = useSelector((state) => state.getCategory);
  const [uploadedData, setUploadedData] = useState(null);
  const { status, loading, course } = useSelector(
    (state) => state.createCourse
  );

  const [courseDetails, setCourseDetails] = useState({
    thumbnail: "",
    courseName: "",
    courseDescription: "",
    price: "",
    category: "",
    whatYouWillLearn: "",
    tag: "",
    instructions: "",
    couponCode: "",
  });

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    if (status === 200) {
      toast.dismiss();
      toast.success("Course created successfully!");
      dispatch(clearCourseState());
      if (course) {
        setUploadedData(course.data);
        dispatch(setCourseBuilderId(course.data._id))
      }
      setCourseDetails({
        thumbnail: null,
        courseName: "",
        courseDescription: "",
        price: "",
        category: "",
        whatYouWillLearn: "",
        tag: "",
        instructions: "",
        couponCode: "",
      });
    } else if (status && status !== 200) {
      toast.error(`Error: ${status}`);
      dispatch(clearCourseState());
    }
  }, [status, dispatch, course]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCourseDetails({ ...courseDetails, thumbnail: file });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value.name);
    setCourseDetails({ ...courseDetails, category: value._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedDetails = {
      ...courseDetails,
      tag: JSON.stringify(
        courseDetails.tag.split(",").map((item) => item.trim())
      ),
      instructions: JSON.stringify(
        courseDetails.instructions.split(",").map((item) => item.trim())
      ),
    };
    try {
      dispatch(createCourse(updatedDetails));
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    }
  };

  return (
    <>
      {uploadedData ? (
        <div className="flex flex-col gap-2">
          <div>
            <CoursePreview
              thumbnail={uploadedData.thumbnail}
              courseName={uploadedData.courseName}
              courseDescription={uploadedData.courseDescription}
              price={uploadedData.price}
              category={uploadedData.category}
              whatYouWillLearn={uploadedData.whatYouWillLearn}
              tag={uploadedData.tag}
              instructions={uploadedData.instructions}
              couponCode={uploadedData.couponCode}
            />
          </div>
          <div>
            <Button
              onClick={() => dispatch(nextStep())}
              className="w-full"
            >
              Next <ArrowRight />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="h-full w-full">
            <div className="text-center p-3 text-2xl font-medium">Course Details</div>
            <Card className="border-none shadow-none">
              <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  {/* Thumbnail Image */}
                  <div>
                    <Label htmlFor="thumbnailImage" className="text-sm font-medium">
                      Thumbnail Image
                    </Label>
                    <div className="relative">
                      <input
                        className="hidden"
                        type="file"
                        id="thumbnailImage"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="thumbnailImage"
                        className="block w-full p-5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-300"
                      >
                        <div className="flex items-center justify-center">
                          <Upload className="mr-2 text-gray-500" />
                          <span className="text-gray-500">Choose file</span>
                        </div>
                      </label>
                      {courseDetails.thumbnail && (
                        <div className="mt-2 text-sm text-gray-600">
                          {courseDetails.thumbnail.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Name & Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="courseName" className="text-sm font-medium">
                        Course Name
                      </Label>
                      <div className="relative">
                        <ClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          className="pl-10 py-3"
                          type="text"
                          id="courseName"
                          placeholder="Course Name"
                          value={courseDetails.courseName}
                          onChange={(e) =>
                            setCourseDetails({
                              ...courseDetails,
                              courseName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium">
                        Price
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          className="pl-10 py-3"
                          type="text"
                          id="price"
                          placeholder="Price"
                          value={courseDetails.price}
                          onChange={(e) =>
                            setCourseDetails({
                              ...courseDetails,
                              price: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description & Learning */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="courseDescription" className="text-sm font-medium">
                        Course Description
                      </Label>
                      <Textarea
                        id="courseDescription"
                        className="min-w-full max-w-full"
                        placeholder="Write a brief description of the course"
                        value={courseDetails.courseDescription}
                        onChange={(e) =>
                          setCourseDetails({
                            ...courseDetails,
                            courseDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatYouWillLearn" className="text-sm font-medium">
                        What You Will Learn
                      </Label>
                      <Textarea
                        id="whatYouWillLearn"
                        className="min-w-full max-w-full"
                        placeholder="List what learners will achieve"
                        value={courseDetails.whatYouWillLearn}
                        onChange={(e) =>
                          setCourseDetails({
                            ...courseDetails,
                            whatYouWillLearn: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Tags & Instructions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tag" className="text-sm font-medium">
                        Tag (comma separated)
                      </Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          className="pl-10 py-3"
                          type="text"
                          id="tag"
                          placeholder="e.g., Programming, Web Development"
                          value={courseDetails.tag}
                          onChange={(e) =>
                            setCourseDetails({
                              ...courseDetails,
                              tag: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instructions" className="text-sm font-medium">
                        Instructions (comma separated)
                      </Label>
                      <div className="relative">
                        <ClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          className="pl-10 py-3"
                          type="text"
                          id="instructions"
                          placeholder="e.g., Follow guidelines, Submit on time"
                          value={courseDetails.instructions}
                          onChange={(e) =>
                            setCourseDetails({
                              ...courseDetails,
                              instructions: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coupon Code & Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="couponCode" className="text-sm font-medium">
                        Coupon Code
                      </Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          className="pl-10 py-3"
                          type="text"
                          id="couponCode"
                          placeholder="Enter coupon code"
                          value={courseDetails.couponCode}
                          onChange={(e) =>
                            setCourseDetails({
                              ...courseDetails,
                              couponCode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category
                      </Label>
                      <div className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left"
                            >
                              {selectedCategory || "Select Category"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            <DropdownMenuLabel>
                              Select a Category
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                              onValueChange={handleCategoryChange}
                            >
                              {categories?.data?.length > 0 ? (
                                categories.data.map((cat) => (
                                  <DropdownMenuRadioItem
                                    key={cat._id}
                                    value={cat}
                                  >
                                    {cat.name}
                                  </DropdownMenuRadioItem>
                                ))
                              ) : (
                                <p className="text-center text-gray-500">
                                  No Categories Found
                                </p>
                              )}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4 flex justify-end">
                    {loading ? (
                      <Button disabled className="flex items-center gap-2">
                        <span className="text-lg">Save</span>
                        <PrimarySpinner />
                      </Button>
                    ) : (
                      <Button type="submit" className="flex items-center gap-2">
                        <span className="text-lg">Save</span>
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

export default CourseInfo;
