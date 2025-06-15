import { fetchLearningCourse } from "@/redux/api/learningCourseSlice";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  UserSquare,
  Info,
  BookOpen,
  Clock,
  CheckCheck,
} from "lucide-react";

import VideoPlayer from "./VideoPlayer";
import CourseContentSidebar from "./CourseContentSidebar";
import CourseRatingReviews from "../CourseRatingReviews";
import ExerciseViewer from "./Execrise/ExerciseViewer";

function EnrolledCoursePage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.fetchLearningCourse);
  const { status, loggedIn, user } = useSelector((state) => state.authUser);

  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");

  const [activeSection, setActiveSection] = useState(0);
  const [activeSubSection, setActiveSubSection] = useState(0);
  const [activeVideoDetails, setActiveVideoDetails] = useState({
    id: "",
    title: "",
    description: "",
    subsectionId: "",
  });
  const [activeTab, setActiveTab] = useState("content");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  // Exercise related state
  const [currentView, setCurrentView] = useState("lesson"); // "lesson" or "exercise"
  const [activeExerciseId, setActiveExerciseId] = useState(null);
  const [activeExerciseData, setActiveExerciseData] = useState(null);

  const extractYouTubeId = useCallback((url) => {
    if (!url) return "";
    const regExp =
      /(?:http?s?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : "";
  }, []);

  const formatDescription = useCallback((text) => {
    if (!text) return "";
    return text.split("\n").map((line, i) => (
      <p key={i} className={i > 0 ? "mt-2" : ""}>
        {line}
      </p>
    ));
  }, []);

  const updateCourseProgress = async (subsectionId) => {
    try {
      setIsMarkingComplete(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/updateCourseProgress`,
        { courseId, subsectionId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setCompletedVideos(prev => [...prev, subsectionId]);
        await fetchProgressPercentage();
        toast.success("Lesson marked as complete!");
      }
    } catch (error) {
      console.error("Error updating course progress:", error);
      toast.error(error.response?.data?.error || "Failed to update progress");
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const fetchProgressPercentage = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/getProgressPercentage`,
        { courseId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setProgressPercentage(response.data.data || 0);
      }
    } catch (error) {
      console.error("Error fetching progress percentage:", error);
    }
  };

  const handleVideoSelection = useCallback(
    (sectionIndex, subSectionIndex) => {
      const section = data?.courseDetails?.courseContent?.[sectionIndex];
      const subSection = section?.subSection?.[subSectionIndex];

      if (!section || !subSection) return;

      const videoId = extractYouTubeId(subSection.videoUrl);

      setActiveSection(sectionIndex);
      setActiveSubSection(subSectionIndex);
      setActiveVideoDetails({
        id: videoId,
        title: subSection.title || "",
        description: subSection.description || "",
        subsectionId: subSection._id || "",
      });

      // Switch back to lesson view
      setCurrentView("lesson");
      setActiveExerciseId(null);
      setActiveExerciseData(null);
    },
    [data, extractYouTubeId]
  );

  const handleExerciseSelection = async (exerciseId, exerciseObject) => {
    try {
      console.log("Exercise ID:", exerciseId);
      console.log("Exercise Object:", exerciseObject);

      // Fetch full exercise data from API
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/exercise/getExercise?exerciseId=${exerciseId}`,
        { withCredentials: true }
      );
      console.log(response)
      if (response.status === 200) {
        setActiveExerciseId(exerciseId);
        setActiveExerciseData(response.data.exercise);
        setCurrentView("exercise");
      } else {
        toast.error("Failed to load exercise");
      }
    } catch (error) {
      console.error("Error fetching exercise:", error);
      toast.error("Failed to load exercise");
    }
  };

  const handleBackToLesson = () => {
    setCurrentView("lesson");
    setActiveExerciseId(null);
    setActiveExerciseData(null);
  };

  const navigateToPrevious = useCallback(() => {
    if (!data?.courseDetails?.courseContent) return;

    let newSectionIndex = activeSection;
    let newSubSectionIndex = activeSubSection - 1;

    if (newSubSectionIndex < 0) {
      for (let i = activeSection - 1; i >= 0; i--) {
        if (data.courseDetails.courseContent[i]?.subSection?.length > 0) {
          newSectionIndex = i;
          newSubSectionIndex = data.courseDetails.courseContent[i].subSection.length - 1;
          break;
        }
      }
    }

    if (data.courseDetails.courseContent[newSectionIndex]?.subSection?.[newSubSectionIndex]) {
      handleVideoSelection(newSectionIndex, newSubSectionIndex);
    }
  }, [activeSection, activeSubSection, data, handleVideoSelection]);

  const navigateToNext = useCallback(() => {
    if (!data?.courseDetails?.courseContent) return;

    let newSectionIndex = activeSection;
    let newSubSectionIndex = activeSubSection + 1;
    const currentSection = data.courseDetails.courseContent[activeSection];

    if (!currentSection?.subSection || newSubSectionIndex >= currentSection.subSection.length) {
      for (let i = activeSection + 1; i < data.courseDetails.courseContent.length; i++) {
        if (data.courseDetails.courseContent[i]?.subSection?.length > 0) {
          newSectionIndex = i;
          newSubSectionIndex = 0;
          break;
        }
      }
    }

    if (data.courseDetails.courseContent[newSectionIndex]?.subSection?.[newSubSectionIndex]) {
      handleVideoSelection(newSectionIndex, newSubSectionIndex);
    }
  }, [activeSection, activeSubSection, data, handleVideoSelection]); // Fixed typo: activeSubSelection -> activeSubSection

  const isPreviousDisabled = useCallback(() => {
    if (!data?.courseDetails?.courseContent) return true;
    if (activeSubSection > 0) return false;

    for (let i = activeSection - 1; i >= 0; i--) {
      if (data.courseDetails.courseContent[i]?.subSection?.length > 0) {
        return false;
      }
    }
    return true;
  }, [activeSection, activeSubSection, data]);

  const isNextDisabled = useCallback(() => {
    if (!data?.courseDetails?.courseContent) return true;
    const currentSection = data.courseDetails.courseContent[activeSection];
    if (currentSection?.subSection && activeSubSection < currentSection.subSection.length - 1) {
      return false;
    }

    for (let i = activeSection + 1; i < data.courseDetails.courseContent.length; i++) {
      if (data.courseDetails.courseContent[i]?.subSection?.length > 0) {
        return false;
      }
    }
    return true;
  }, [activeSection, activeSubSection, data]);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchLearningCourse({ courseId }));
      fetchProgressPercentage();
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (data?.courseDetails?.courseContent) {
      if (data.completedVideos) {
        setCompletedVideos(data.completedVideos);
      }

      // Only set initial video if we're in lesson view and no video is currently active
      if (currentView === "lesson" && !activeVideoDetails.id) {
        for (let i = 0; i < data.courseDetails.courseContent.length; i++) {
          const section = data.courseDetails.courseContent[i];
          if (section.subSection && section.subSection.length > 0) {
            const firstSubSection = section.subSection[0];
            setActiveSection(i);
            setActiveSubSection(0);
            setActiveVideoDetails({
              id: extractYouTubeId(firstSubSection.videoUrl),
              title: firstSubSection.title || "",
              description: firstSubSection.description || "",
              subsectionId: firstSubSection._id || "",
            });
            break;
          }
        }
      }
    }
  }, [data, extractYouTubeId, currentView, activeVideoDetails.id]); // Added activeVideoDetails.id dependency

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data?.courseDetails) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <Info className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium">Course data not available</h2>
        <p className="text-muted-foreground mt-2">Please try again later or contact support.</p>
      </div>
    );
  }

  const { courseDetails } = data;
  const isCurrentVideoCompleted = completedVideos.includes(activeVideoDetails.subsectionId);

  // Render Exercise View
  if (currentView === "exercise" && activeExerciseId) {
    return (
      <div className="min-h-screen bg-background">
        <ExerciseViewer
          exerciseId={activeExerciseId}
          exerciseData={activeExerciseData}
          onBackToLesson={handleBackToLesson}
          userId={user?._id}
          courseId={courseId}
        />
      </div>
    );
  }

  // Render Lesson View (Original Layout)
  return (
    <div className="container mx-auto px-2 py-4 md:px-4 lg:px-6 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 order-1">
          <VideoPlayer
            activeVideoDetails={activeVideoDetails}
            onVideoEnd={navigateToNext}
            isNextDisabled={isNextDisabled}
          />

          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  {activeVideoDetails.title || courseDetails.courseName || "Course"}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {activeVideoDetails.description || "Select a lesson to view its description"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <UserSquare className="h-4 w-4 mr-1" />
                {courseDetails.instructor?.firstName || "Unknown"} {courseDetails.instructor?.lastName || "Instructor"}
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {courseDetails.category?.name || "Category N/A"}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {data.totalDuration && data.totalDuration !== "NaNs" ? data.totalDuration : "Self-paced"}
              </div>
            </div>

            <div className="my-3 flex">
              {activeVideoDetails.subsectionId && (
                <Button
                  onClick={() => updateCourseProgress(activeVideoDetails.subsectionId)}
                  disabled={isCurrentVideoCompleted || isMarkingComplete}
                  className={`ml-auto ${isCurrentVideoCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {isMarkingComplete ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Marking...
                    </>
                  ) : isCurrentVideoCompleted ? (
                    <>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="flex justify-between mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToPrevious}
                disabled={isPreviousDisabled()}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Lesson
              </Button>
              <Button size="sm" onClick={navigateToNext} disabled={isNextDisabled()}>
                Next Lesson
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 w-full md:w-auto">
                <TabsTrigger value="content">About Course</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Course Description</h3>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {formatDescription(courseDetails.courseDescription)}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-3">What You'll Learn</h3>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {formatDescription(courseDetails.whatYouWillLearn)}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="mt-2">
                <h3 className="text-lg font-medium mb-3">Course Instructions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {courseDetails.instructions?.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{instruction}</span>
                    </div>
                  )) || <p className="text-sm text-muted-foreground">No instructions available</p>}
                </div>
              </TabsContent>

              <TabsContent value="tags" className="mt-2">
                <h3 className="text-lg font-medium mb-3">Course Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {courseDetails.tag?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs py-1">
                      {tag}
                    </Badge>
                  )) || <p className="text-sm text-muted-foreground">No tags available</p>}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>

        <div className="lg:col-span-1 order-2">
          <CourseContentSidebar
            courseContent={courseDetails.courseContent}
            activeSection={activeSection}
            activeSubSection={activeSubSection}
            completedVideos={completedVideos}
            progressPercentage={progressPercentage}
            onVideoSelection={handleVideoSelection}
            onExerciseSelection={handleExerciseSelection}
          />
        </div>
      </div>
      <CourseRatingReviews courseId={courseId} isLoggedIn={loggedIn} user={user} />
    </div>
  );
}

export default EnrolledCoursePage;