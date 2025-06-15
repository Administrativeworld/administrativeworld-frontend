import { useEffect, useState } from "react";
import { nextStep, setCourseBuilderId } from "@/redux/api/courseBuilderSlice";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  ClipboardList,
  Tag,
  Upload,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearCourseState, } from "@/redux/api/createCourseSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "@/redux/api/getCategorySlice";
import PrimarySpinner from "../../Loaders/PrimarySpinner";
import CoursePreview from "../CreateCourses/CoursePreview";
import { ArrowRight } from "@mynaui/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { getACourse } from '@/redux/api/getACourseSlice';
import axios from 'axios';

function EditCourseInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('id');

  const { course, loading } = useSelector((state) => state.getACourse);
  const { categories } = useSelector((state) => state.getCategory);
  const { status } = useSelector((state) => state.createCourse);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadedData, setUploadedData] = useState(null);
  const [isEditing, setIsEditing] = useState(!!courseId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize courseDetails with default values
  const [courseDetails, setCourseDetails] = useState({
    thumbnail: null,
    courseName: "",
    courseId: "", // This will be populated with courseId from URL
    courseDescription: "",
    price: "",
    category: "",
    whatYouWillLearn: "",
    tag: "",
    instructions: "",
    thumbnail_public_id: "",
    thumbnail_format: "",
    thumbnail_resource_type: "",
    thumbnail_bytes: "",
  });

  // Fetch course data when courseId is available
  useEffect(() => {
    if (courseId) {
      dispatch(getACourse(courseId));
    }
  }, [courseId, dispatch]);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  // Update form data when course is loaded
  useEffect(() => {
    if (course && courseId) {
      setCourseDetails({
        thumbnail: course.thumbnail || null,
        courseId: course._id || courseId, // Ensure courseId is set
        courseName: course.courseName || "",
        courseDescription: course.courseDescription || "",
        price: course.price || "",
        category: course.category?._id || "",
        whatYouWillLearn: course.whatYouWillLearn || "",
        tag: Array.isArray(course.tag) ? course.tag.join(", ") : course.tag || "",
        instructions: Array.isArray(course.instructions) ? course.instructions.join(", ") : course.instructions || "",
        thumbnail_public_id: course.thumbnail_public_id || "",
        thumbnail_format: course.thumbnail_format || "",
        thumbnail_resource_type: course.thumbnail_resource_type || "",
        thumbnail_bytes: course.thumbnail_bytes || "",
      });
      setSelectedCategory(course.category?.name || "");
    }
  }, [course, courseId]);

  // Handle form submission response for create course (if you have a create flow)
  useEffect(() => {
    if (status === 200) {
      toast.dismiss();
      toast.success(isEditing ? "Course updated successfully!" : "Course created successfully!");
      dispatch(clearCourseState());
      if (course) {
        setUploadedData(course.data);
        dispatch(setCourseBuilderId(course.data._id));
      }
      // Reset form only if not editing
      if (!isEditing) {
        setCourseDetails({
          thumbnail: null,
          courseName: "",
          courseDescription: "",
          price: "",
          category: "",
          whatYouWillLearn: "",
          tag: "",
          instructions: "",
        });
        setSelectedCategory("");
      }
    } else if (status && status !== 200) {
      toast.error(`Error: ${status}`);
      dispatch(clearCourseState());
    }
  }, [status, dispatch, course, isEditing]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCourseDetails({ ...courseDetails, thumbnail: file });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value.name);
    setCourseDetails({ ...courseDetails, category: value._id });
  };

  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };
    return await imageCompression(imageFile, options);
  };

  const uploadToCloudinary = async (file, url, uploadPreset, resourceType) => {
    try {
      const { data: signatureData } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/generate/generateSignature`,
        {
          uploadPreset: uploadPreset,
          resourceType: resourceType
        }
      );

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      cloudinaryFormData.append("upload_preset", uploadPreset);
      cloudinaryFormData.append("resource_type", resourceType);
      cloudinaryFormData.append("timestamp", signatureData.timestamp);
      cloudinaryFormData.append("signature", signatureData.signature);

      const response = await axios.post(url, cloudinaryFormData);

      return response.data;
    } catch (error) {
      throw new Error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!courseDetails.courseName || !courseDetails.courseDescription || !courseDetails.price || !courseDetails.category) {
        toast.error("Please fill in all required fields");
        return;
      }

      let updatedDetails = {
        ...courseDetails,
        // Send as comma-separated strings, not JSON strings
        tag: courseDetails.tag.split(",").map((item) => item.trim()).join(","),
        instructions: courseDetails.instructions.split(",").map((item) => item.trim()).join(","),
      };

      // Handle thumbnail upload if it's a new file
      if (courseDetails.thumbnail && typeof courseDetails.thumbnail === 'object') {
        toast.loading("Uploading thumbnail...");

        const compressedThumbnail = await compressImage(courseDetails.thumbnail);

        const thumbnailData = await uploadToCloudinary(
          compressedThumbnail,
          import.meta.env.VITE_CLOUDINARY_URL,
          import.meta.env.VITE_AW_COURSES_UPLOAD_PRESET,
          "image"
        );

        updatedDetails.thumbnail = thumbnailData.secure_url;
        updatedDetails.thumbnail_public_id = thumbnailData.public_id;
        updatedDetails.thumbnail_format = thumbnailData.format;
        updatedDetails.thumbnail_resource_type = thumbnailData.resource_type;
        updatedDetails.thumbnail_bytes = thumbnailData.bytes;
        toast.dismiss();
      }

      if (isEditing && courseId) {
        // Update existing course
        toast.loading("Updating course...");

        // Ensure courseId is in the request body
        updatedDetails.courseId = courseId;

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/courses/editCourse`,
          updatedDetails,
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.dismiss();
          dispatch(setCourseBuilderId(courseId))
          toast.success('Course details Updated ');
          dispatch(nextStep())
        } else {
          toast.dismiss();
          toast.error(response.data.message || 'Failed to update course');
        }
      }

    } catch (error) {
      console.error("Error processing course:", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to process course: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !course) {
    return (
      <div className="flex justify-center items-center h-64">
        <PrimarySpinner />
      </div>
    );
  }

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
            <div className="text-center p-3 text-2xl font-medium">
              {isEditing ? "Edit Course Details" : "Course Details"}
            </div>
            <Card className="border-none shadow-none">
              <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  {/* Thumbnail Image */}
                  <div>
                    <Label htmlFor="thumbnailImage" className="text-sm font-medium">
                      Thumbnail Image *
                    </Label>
                    <div className="space-y-4">
                      {/* Thumbnail Preview */}
                      {(courseDetails.thumbnail || (course && course.thumbnail)) && (
                        <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={
                              courseDetails.thumbnail && typeof courseDetails.thumbnail === 'object'
                                ? URL.createObjectURL(courseDetails.thumbnail)
                                : course?.thumbnail || courseDetails.thumbnail
                            }
                            alt="Course thumbnail preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center" style={{ display: 'none' }}>
                            <span className="text-gray-500">Preview not available</span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                              onClick={() => setCourseDetails({ ...courseDetails, thumbnail: null })}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Upload Area */}
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
                          className={`block w-full p-5 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${courseDetails.thumbnail || (course && course.thumbnail)
                            ? 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            }`}
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Upload className="w-8 h-8 text-gray-400" />
                            <div className="text-center">
                              <span className="text-sm font-medium text-gray-600">
                                {courseDetails.thumbnail || (course && course.thumbnail)
                                  ? "Change thumbnail"
                                  : "Upload thumbnail"}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </label>

                        {/* File name display */}
                        {courseDetails.thumbnail && typeof courseDetails.thumbnail === 'object' && (
                          <div className="mt-2 text-sm text-gray-600 flex items-center">
                            <span className="font-medium">Selected:</span>
                            <span className="ml-2 truncate">{courseDetails.thumbnail.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course Name & Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="courseName" className="text-sm font-medium">
                        Course Name *
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
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium">
                        Price *
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                          className="pl-10 py-3"
                          type="number"
                          id="price"
                          placeholder="Price"
                          value={courseDetails.price}
                          onChange={(e) =>
                            setCourseDetails({
                              ...courseDetails,
                              price: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description & Learning */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="courseDescription" className="text-sm font-medium">
                        Course Description *
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
                        required
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
                        Tags (comma separated)
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

                  {/* Category */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category *
                      </Label>
                      <div className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left justify-start"
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
                              value={categories?.find(cat => cat._id === courseDetails.category)}
                            >
                              {categories?.length > 0 ? (
                                categories.map((cat) => (
                                  <DropdownMenuRadioItem
                                    key={cat._id}
                                    value={cat}
                                  >
                                    {cat.name}
                                  </DropdownMenuRadioItem>
                                ))
                              ) : (
                                <p className="text-center text-gray-500 p-2">
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
                    {isSubmitting || loading ? (
                      <Button disabled className="flex items-center gap-2">
                        <span className="text-lg">
                          {isEditing ? "Updating..." : "Saving..."}
                        </span>
                        <PrimarySpinner />
                      </Button>
                    ) : (
                      <Button type="submit" className="flex items-center gap-2">
                        <span className="text-lg">
                          {isEditing ? "Update Course" : "Save Course"}
                        </span>
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

export default EditCourseInfo;