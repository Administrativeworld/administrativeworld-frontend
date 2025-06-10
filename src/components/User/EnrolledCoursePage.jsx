import { fetchLearningCourse } from "@/redux/api/learningCourseSlice";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";


import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  CheckCircle,
  Circle,
  BookOpen,
  Clock,
  UserSquare,
  Info,
  RotateCcw,
  Volume2,
  Maximize,
  CheckCheck,
} from "lucide-react";

// Custom Player Component
import YouTubePlayer from "../Player/YouTubePlayer";
import CourseRatingReviews from "./CourseRatingReviews";

function EnrolledCoursePage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.fetchLearningCourse);
  const { status, loggedIn, user } = useSelector((state) => state.authUser);

  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");

  // State for active video and course content
  const [activeSection, setActiveSection] = useState(0);
  const [activeSubSection, setActiveSubSection] = useState(0);
  const [activeVideoDetails, setActiveVideoDetails] = useState({
    id: "",
    title: "",
    description: "",
    subsectionId: "",
  });
  const [activeTab, setActiveTab] = useState("content");
  const [expandedSections, setExpandedSections] = useState({});

  // State for course progress
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  // State for YouTube player
  const [playerState, setPlayerState] = useState({
    playing: false,
    currentTime: 0,
    duration: 0,
  });
  const playerRef = useRef(null);

  // --- Utility Functions ---

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

  // --- API Functions ---

  const updateCourseProgress = async (subsectionId) => {
    try {
      setIsMarkingComplete(true);
      console.log({ courseId: courseId, subsectionId: subsectionId })
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/courses/updateCourseProgress`, {
        courseId,
        subsectionId,
      }, { withCredentials: true });

      if (response.status === 200) {
        // Update local state
        setCompletedVideos(prev => [...prev, subsectionId]);

        // Fetch updated progress percentage
        await fetchProgressPercentage();

        // Fixed toast call - use react-hot-toast syntax
        toast.success("Lesson marked as complete!");
      }
    } catch (error) {
      console.error("Error updating course progress:", error);
      // Fixed toast call - use react-hot-toast syntax
      toast.error(error.response?.data?.error || "Failed to update progress");
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const fetchProgressPercentage = async () => {
    try {
      console.log("courseId", courseId)
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/courses/getProgressPercentage`, {
        courseId,
      }, {
        withCredentials: true,
      }
      );

      if (response.status === 200) {
        setProgressPercentage(response.data.data || 0);
      }
    } catch (error) {
      console.error("Error fetching progress percentage:", error);
    }
  };

  // --- Effects ---

  // Fetch course data
  useEffect(() => {
    if (courseId) {
      dispatch(fetchLearningCourse({ courseId }));
      fetchProgressPercentage();
    }
  }, [courseId, dispatch]);

  // Initialize component state
  useEffect(() => {
    if (data?.courseDetails?.courseContent) {
      // Set completed videos from API response
      if (data.completedVideos) {
        setCompletedVideos(data.completedVideos);
      }

      // Initialize expanded sections
      const initialExpanded = {};
      data.courseDetails.courseContent.forEach((section, index) => {
        initialExpanded[index] = true;
      });
      setExpandedSections(initialExpanded);

      // Set first available video as active
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
  }, [data, extractYouTubeId]);

  // --- Handlers ---

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

      setPlayerState({
        playing: false,
        currentTime: 0,
        duration: 0,
      });
    },
    [data, extractYouTubeId]
  );

  const toggleSection = (sectionIndex) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
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
  }, [activeSection, activeSubSection, data, handleVideoSelection]);

  // --- YouTube Player Event Handlers ---

  const onPlayerReady = useCallback((event) => {
    playerRef.current = event.target;
  }, []);

  const onPlayerStateChange = useCallback((event) => {
    if (!window.YT) return;

    setPlayerState(prev => ({
      ...prev,
      playing: event.data === window.YT.PlayerState.PLAYING,
    }));

    if (event.data === window.YT.PlayerState.PLAYING) {
      if (playerRef.current?.updateInterval) {
        clearInterval(playerRef.current.updateInterval);
      }
      playerRef.current.updateInterval = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          setPlayerState(prev => ({
            ...prev,
            currentTime: playerRef.current.getCurrentTime() || 0,
            duration: playerRef.current.getDuration() || 0,
          }));
        }
      }, 1000);
    } else {
      if (playerRef.current?.updateInterval) {
        clearInterval(playerRef.current.updateInterval);
        playerRef.current.updateInterval = null;
      }
    }

    if (event.data === window.YT.PlayerState.ENDED) {
      console.log(`Video ${activeVideoDetails.id} ended.`);
      if (!isNextDisabled()) {
        navigateToNext();
      }
    }
  }, [activeVideoDetails.id, navigateToNext]);

  // Cleanup interval on unmount
  useEffect(() => {
    if (playerRef.current?.updateInterval) {
      clearInterval(playerRef.current.updateInterval);
      playerRef.current.updateInterval = null;
    }

    // Reset player state when video changes
    setPlayerState({
      playing: false,
      currentTime: 0,
      duration: 0,
    });
  }, [activeVideoDetails.id]);

  // --- Player Controls ---

  const togglePlayPause = () => {
    if (playerRef.current) {
      try {
        if (playerState.playing) {
          if (typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
          }
        } else {
          if (typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          }
        }
      } catch (error) {
        console.error('Error controlling video playback:', error);
      }
    }
  };
  const stopVideo = () => {
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
        // Optionally seek to beginning
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(0);
        }
      } catch (error) {
        console.error('Error stopping video:', error);
      }
    }
  };
  const restartVideo = () => {
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(0);
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } catch (error) {
        console.error('Error restarting video:', error);
      }
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current?.getIframe) {
      try {
        const iframe = playerRef.current.getIframe();
        if (iframe?.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe?.mozRequestFullScreen) {
          iframe.mozRequestFullScreen();
        } else if (iframe?.webkitRequestFullscreen) {
          iframe.webkitRequestFullscreen();
        } else if (iframe?.msRequestFullscreen) {
          iframe.msRequestFullscreen();
        }
      } catch (error) {
        console.error('Error toggling fullscreen:', error);
      }
    }
  };

  // --- Navigation Logic ---

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

  // --- Render Logic ---

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
        <p className="text-muted-foreground mt-2">
          Please try again later or contact support.
        </p>
      </div>
    );
  }

  const { courseDetails } = data;
  const totalVideos = courseDetails.courseContent?.reduce(
    (acc, section) => acc + (section?.subSection?.length || 0),
    0
  ) || 0;

  const isCurrentVideoCompleted = completedVideos.includes(activeVideoDetails.subsectionId);

  return (
    <div className="container mx-auto px-2 py-4 md:px-4 lg:px-6 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 order-1">
          <Card className="mb-6 overflow-hidden">
            <div className="aspect-video bg-black relative w-full">
              {activeVideoDetails.id ? (
                <div className="relative w-full h-full">
                  <YouTubePlayer
                    videoId={activeVideoDetails.id}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                  />

                  {/* Custom Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between items-center text-white opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={togglePlayPause}
                      >
                        {playerState.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={restartVideo}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <div className="text-xs ml-2">
                        {Math.floor(playerState.currentTime / 60)}:
                        {Math.floor(playerState.currentTime % 60).toString().padStart(2, "0")} /{" "}
                        {Math.floor(playerState.duration / 60)}:
                        {Math.floor(playerState.duration % 60).toString().padStart(2, "0")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={toggleFullscreen}
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center p-6">
                    <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Select a lesson to start learning</p>
                  </div>
                </div>
              )}
            </div>

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
              {/* Mark as Complete Button */}
              <div className=" my-3 flex">
                {activeVideoDetails.subsectionId && (
                  <Button
                    onClick={() => updateCourseProgress(activeVideoDetails.subsectionId)}
                    disabled={isCurrentVideoCompleted || isMarkingComplete}
                    className={` ml-auto ${isCurrentVideoCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
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
                <Button
                  size="sm"
                  onClick={navigateToNext}
                  disabled={isNextDisabled()}
                >
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
          </Card>
        </div>

        {/* Course Content Sidebar */}
        <div className="lg:col-span-1 order-2">
          <Card className="h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">Course Content</h3>
              <div className="text-sm text-muted-foreground flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {totalVideos} {totalVideos === 1 ? "lesson" : "lessons"}
              </div>
            </div>

            <CardContent className="p-0">
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Your progress</span>
                    <span className="font-medium">
                      {completedVideos.length} / {totalVideos} completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {progressPercentage.toFixed(1)}%
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-220px)] pr-4">
                  {courseDetails.courseContent?.map((section, sectionIndex) => {
                    const hasSubSections = section?.subSection && section.subSection.length > 0;
                    return (
                      <div key={section._id || sectionIndex} className="mb-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-between items-center p-3 h-auto text-left font-medium hover:bg-muted/50"
                          onClick={() => toggleSection(sectionIndex)}
                        >
                          <span className="text-sm font-medium">
                            {sectionIndex + 1}. {section.sectionName || "Untitled Section"}
                          </span>
                          <div className="flex items-center text-xs text-muted-foreground">
                            {hasSubSections ? `${section.subSection.length} lessons` : "No lessons"}
                            <ChevronRight
                              className={`h-4 w-4 ml-1 transition-transform ${expandedSections[sectionIndex] ? "rotate-90" : ""
                                }`}
                            />
                          </div>
                        </Button>

                        {expandedSections[sectionIndex] && hasSubSections && (
                          <div className="pl-4 mt-1 space-y-1">
                            {section.subSection.map((subSection, subIndex) => {
                              const isActive = sectionIndex === activeSection && subIndex === activeSubSection;
                              const isCompleted = completedVideos.includes(subSection._id);

                              return (
                                <Button
                                  key={subSection._id || subIndex}
                                  variant="ghost"
                                  className={`w-full justify-start py-2 px-3 h-auto text-left ${isActive ? "bg-muted" : ""
                                    }`}
                                  onClick={() => handleVideoSelection(sectionIndex, subIndex)}
                                >
                                  <div className="flex items-start w-full">
                                    {isCompleted ? (
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex flex-col text-left">
                                      <span className="text-sm font-medium">{subSection.title || "Untitled Lesson"}</span>
                                      <span className="text-xs text-muted-foreground mt-0.5 flex items-center">
                                        <Play className="h-3 w-3 mr-1" />
                                        {subSection.timeDuration && subSection.timeDuration !== "N/A"
                                          ? subSection.timeDuration
                                          : "Video"}
                                      </span>
                                    </div>
                                  </div>
                                </Button>
                              );
                            })}
                          </div>
                        )}

                        {expandedSections[sectionIndex] && !hasSubSections && (
                          <div className="pl-4 mt-2 mb-2">
                            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground bg-muted/30 rounded-md">
                              <Info className="h-4 w-4 mr-2" />
                              <span>Content coming soon</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }) || (
                      <div className="flex items-center justify-center p-8 text-muted-foreground">
                        <Info className="h-4 w-4 mr-2" />
                        <span>No course content available</span>
                      </div>
                    )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CourseRatingReviews courseId={courseId} isLoggedIn={loggedIn} user={user} />
    </div>
  );
}

export default EnrolledCoursePage;