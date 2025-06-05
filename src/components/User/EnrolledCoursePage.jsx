import { fetchLearningCourse } from "@/redux/api/learningCourseSlice";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons
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
} from "lucide-react";

// Custom Player Component (will be defined below)
import YouTubePlayer from "../Player/YouTubePlayer";

function EnrolledCoursePage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.fetchLearningCourse);
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");

  // State for active video and course content
  const [activeSection, setActiveSection] = useState(0);
  const [activeSubSection, setActiveSubSection] = useState(0);
  const [activeVideoDetails, setActiveVideoDetails] = useState({
    id: "",
    title: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState("content");
  const [expandedSections, setExpandedSections] = useState({});

  // State for YouTube player internal progress
  const [playerState, setPlayerState] = useState({
    playing: false,
    currentTime: 0,
    duration: 0,
    loaded: 0,
  });
  const playerRef = useRef(null); // Ref to hold the YouTube player instance

  // --- Utility Functions ---

  // Extracts YouTube ID from various URL formats
  const extractYouTubeId = useCallback((url) => {
    if (!url) return "";

    const regExp =
      /(?:http?s?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : "";
  }, []);

  // Formats multiline descriptions into paragraphs
  const formatDescription = useCallback((text) => {
    if (!text) return "";
    return text.split("\n").map((line, i) => (
      <p key={i} className={i > 0 ? "mt-2" : ""}>
        {line}
      </p>
    ));
  }, []);

  // --- Effects for Data Loading and Initial Setup ---

  // Fetch course data on courseId change
  useEffect(() => {
    if (courseId) {
      dispatch(fetchLearningCourse({ courseId: courseId }));
    }
  }, [courseId, dispatch]);

  // Initialize expanded sections and set initial active video
  useEffect(() => {
    if (data?.courseDetails?.courseContent) {
      const initialExpanded = {};
      data.courseDetails.courseContent.forEach((section, index) => {
        initialExpanded[index] = true; // Expand all sections by default
      });
      setExpandedSections(initialExpanded);

      // Set the first available video as active
      for (let i = 0; i < data.courseDetails.courseContent.length; i++) {
        const section = data.courseDetails.courseContent[i];
        if (section.subSection && section.subSection.length > 0) {
          const firstSubSection = section.subSection[0];
          setActiveSection(i);
          setActiveSubSection(0);
          setActiveVideoDetails({
            id: extractYouTubeId(firstSubSection.videoUrl),
            title: firstSubSection.title,
            description: firstSubSection.description,
          });
          break; // Found the first video, exit loop
        }
      }
    }
  }, [data, extractYouTubeId]);

  // --- Handlers for Video Selection and Navigation ---

  const handleVideoSelection = useCallback(
    (sectionIndex, subSectionIndex) => {
      const section = data.courseDetails.courseContent[sectionIndex];
      const subSection = section.subSection[subSectionIndex];
      const videoId = extractYouTubeId(subSection.videoUrl);

      setActiveSection(sectionIndex);
      setActiveSubSection(subSectionIndex);
      setActiveVideoDetails({
        id: videoId,
        title: subSection.title,
        description: subSection.description,
      });

      // Reset player state to ensure it starts fresh when a new video is selected
      setPlayerState({
        playing: false,
        currentTime: 0,
        duration: 0,
        loaded: 0,
      });
    },
    [data, extractYouTubeId]
  );

  const navigateToPrevious = useCallback(() => {
    let newSectionIndex = activeSection;
    let newSubSectionIndex = activeSubSection - 1;

    if (newSubSectionIndex < 0) {
      // If at start of section, find previous section with videos
      for (let i = activeSection - 1; i >= 0; i--) {
        if (data.courseDetails.courseContent[i].subSection?.length > 0) {
          newSectionIndex = i;
          newSubSectionIndex =
            data.courseDetails.courseContent[i].subSection.length - 1;
          break;
        }
      }
    }

    if (
      data.courseDetails.courseContent[newSectionIndex]?.subSection?.[
      newSubSectionIndex
      ]
    ) {
      handleVideoSelection(newSectionIndex, newSubSectionIndex);
    }
  }, [activeSection, activeSubSection, data, handleVideoSelection]);

  const navigateToNext = useCallback(() => {
    let newSectionIndex = activeSection;
    let newSubSectionIndex = activeSubSection + 1;
    const currentSection = data.courseDetails.courseContent[activeSection];

    if (
      !currentSection.subSection ||
      newSubSectionIndex >= currentSection.subSection.length
    ) {
      // If at end of current section, find next section with videos
      for (let i = activeSection + 1; i < data.courseDetails.courseContent.length; i++) {
        if (data.courseDetails.courseContent[i].subSection?.length > 0) {
          newSectionIndex = i;
          newSubSectionIndex = 0;
          break;
        }
      }
    }

    if (
      data.courseDetails.courseContent[newSectionIndex]?.subSection?.[
      newSubSectionIndex
      ]
    ) {
      handleVideoSelection(newSectionIndex, newSubSectionIndex);
    }
  }, [activeSection, activeSubSection, data, handleVideoSelection]);

  // --- YouTube Player Event Handlers ---

  const onPlayerReady = useCallback((event) => {
    playerRef.current = event.target; // Store the player instance
    // You could set initial volume or check for autoplay here if needed
  }, []);

  const onPlayerStateChange = useCallback(
    (event) => {
      // YT.PlayerState is an enum for player states
      // -1 (unstarted)
      // 0 (ended)
      // 1 (playing)
      // 2 (paused)
      // 3 (buffering)
      // 5 (video cued)

      setPlayerState((prev) => ({
        ...prev,
        playing: event.data === window.YT.PlayerState.PLAYING,
      }));

      // If playing, continuously update current time and duration
      if (event.data === window.YT.PlayerState.PLAYING) {
        // Clear any existing interval to prevent multiple intervals running
        if (playerRef.current.updateInterval) {
          clearInterval(playerRef.current.updateInterval);
        }
        playerRef.current.updateInterval = setInterval(() => {
          if (playerRef.current) {
            setPlayerState((prev) => ({
              ...prev,
              currentTime: playerRef.current.getCurrentTime(),
              duration: playerRef.current.getDuration(),
              loaded: playerRef.current.getVideoLoadedFraction() * 100,
            }));
          }
        }, 1000); // Update every second
      } else {
        // Clear interval when not playing
        if (playerRef.current.updateInterval) {
          clearInterval(playerRef.current.updateInterval);
          playerRef.current.updateInterval = null; // Clean up reference
        }
      }

      // If video ended
      if (event.data === window.YT.PlayerState.ENDED) {
        // TODO: Dispatch action to mark video as completed
        // For example: dispatch(markVideoAsCompleted({ courseId, videoId: activeVideoDetails.id }));
        console.log(`Video ${activeVideoDetails.id} ended. Marking as complete.`);

        // Auto navigate to next video if not the last one
        if (!isNextDisabled()) {
          navigateToNext();
        }
      }
    },
    [activeVideoDetails.id, navigateToNext]
  );

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (playerRef.current && playerRef.current.updateInterval) {
        clearInterval(playerRef.current.updateInterval);
      }
    };
  }, []);


  // --- Custom Player Controls ---

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (playerState.playing) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const restartVideo = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current && playerRef.current.getIframe()) {
      const iframe = playerRef.current.getIframe();
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        /* Firefox */
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        /* IE/Edge */
        iframe.msRequestFullscreen();
      }
    }
  };

  // --- Navigation Button Logic ---

  const isPreviousDisabled = useCallback(() => {
    if (!data?.courseDetails?.courseContent) return true;
    if (activeSubSection > 0) return false; // If there's a previous video in current section

    // Check if there are any previous sections with videos
    for (let i = activeSection - 1; i >= 0; i--) {
      if (data.courseDetails.courseContent[i].subSection?.length > 0) {
        return false;
      }
    }
    return true; // No previous video found
  }, [activeSection, activeSubSection, data]);

  const isNextDisabled = useCallback(() => {
    if (!data?.courseDetails?.courseContent) return true;
    const currentSection = data.courseDetails.courseContent[activeSection];
    if (
      currentSection.subSection &&
      activeSubSection < currentSection.subSection.length - 1
    ) {
      return false; // If there's a next video in current section
    }

    // Check if there are any next sections with videos
    for (let i = activeSection + 1; i < data.courseDetails.courseContent.length; i++) {
      if (data.courseDetails.courseContent[i].subSection?.length > 0) {
        return false;
      }
    }
    return true; // No next video found
  }, [activeSection, activeSubSection, data]);

  // --- Render Logic (Loading, Error, Main Content) ---

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data || !data.courseDetails) {
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

  const { courseDetails, completedVideos } = data;

  // Calculate course progress
  const totalVideos = courseDetails.courseContent.reduce(
    (acc, section) => acc + (section.subSection?.length || 0),
    0
  );
  const progress = totalVideos > 0 ? (completedVideos.length / totalVideos) * 100 : 0;

  return (
    <div className="container mx-auto px-2 py-4 md:px-4 lg:px-6 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main content area - Video player and details */}
        <div className="lg:col-span-2 order-1">
          <Card className="mb-6 shadow-sm overflow-hidden">
            <div className="aspect-video bg-black relative w-full">
              {activeVideoDetails.id ? (
                <div className="relative w-full h-full">
                  <YouTubePlayer
                    videoId={activeVideoDetails.id}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                  />

                  {/* Custom video controls overlay */}
                  {/* The opacity-0 and hover:opacity-100 will make them appear on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between items-center text-white opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={togglePlayPause}
                        aria-label={playerState.playing ? "Pause video" : "Play video"}
                      >
                        {playerState.playing ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={restartVideo}
                        aria-label="Restart video"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <div className="text-xs ml-2">
                        {Math.floor(playerState.currentTime / 60)}:
                        {Math.floor(playerState.currentTime % 60)
                          .toString()
                          .padStart(2, "0")}{" "}
                        /{" "}
                        {Math.floor(playerState.duration / 60)}:
                        {Math.floor(playerState.duration % 60)
                          .toString()
                          .padStart(2, "0")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* You'll need to implement volume control logic for YouTube API if you want it to work */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        aria-label="Volume control"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={toggleFullscreen}
                        aria-label="Toggle fullscreen"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <div className="text-center p-6">
                    <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Select a lesson to start learning
                    </p>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4 lg:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-1">
                {activeVideoDetails.title || courseDetails.courseName}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {activeVideoDetails.description ||
                  "Select a lesson to view its description"}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <UserSquare className="h-4 w-4 mr-1" />
                  {courseDetails.instructor.firstName}{" "}
                  {courseDetails.instructor.lastName}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {courseDetails.category.name}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {data.totalDuration && data.totalDuration !== "NaNs"
                    ? data.totalDuration
                    : "Self-paced"}
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={navigateToPrevious}
                  disabled={isPreviousDisabled()}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous Lesson
                </Button>
                <Button
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={navigateToNext}
                  disabled={isNextDisabled()}
                >
                  Next Lesson <ChevronRight className="h-4 w-4" />
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
                      <h3 className="text-lg font-medium mb-3">
                        Course Description
                      </h3>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {formatDescription(courseDetails.courseDescription)}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        What You'll Learn
                      </h3>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {formatDescription(courseDetails.whatYouWillLearn)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="instructions" className="mt-2">
                  <h3 className="text-lg font-medium mb-3">
                    Course Instructions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {courseDetails.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tags" className="mt-2">
                  <h3 className="text-lg font-medium mb-3">Course Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {courseDetails.tag.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar - Course content */}
        <div className="lg:col-span-1 order-2">
          <Card className="h-full shadow-sm">
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
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your progress</span>
                    <span>
                      {completedVideos.length} / {totalVideos} completed
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <ScrollArea className="h-[calc(100vh-220px)] pr-4">
                  {courseDetails.courseContent.map((section, sectionIndex) => {
                    const hasSubSections =
                      section.subSection && section.subSection.length > 0;
                    return (
                      <div key={section._id} className="mb-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-between items-center p-3 h-auto text-left font-medium hover:bg-secondary"
                          onClick={() => toggleSection(sectionIndex)}
                        >
                          <div className="flex items-center">
                            <span>
                              {sectionIndex + 1}. {section.sectionName}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            {hasSubSections
                              ? `${section.subSection.length} lessons`
                              : "No lessons"}
                            <ChevronRight
                              className={`h-4 w-4 ml-1 transition-transform ${expandedSections[sectionIndex]
                                ? "rotate-90"
                                : ""
                                }`}
                            />
                          </div>
                        </Button>

                        {expandedSections[sectionIndex] && hasSubSections && (
                          <div className="pl-4 mt-1 space-y-1">
                            {section.subSection.map((subSection, subIndex) => {
                              const isActive =
                                sectionIndex === activeSection &&
                                subIndex === activeSubSection;
                              const isCompleted = completedVideos.includes(
                                subSection._id
                              );

                              return (
                                <Button
                                  key={subSection._id}
                                  variant="ghost"
                                  className={`w-full justify-start py-2 px-3 h-auto text-left ${isActive ? "bg-secondary" : ""
                                    }`}
                                  onClick={() =>
                                    handleVideoSelection(sectionIndex, subIndex)
                                  }
                                >
                                  <div className="flex items-start">
                                    {isCompleted ? (
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">
                                        {subSection.title}
                                      </span>
                                      <span className="text-xs text-muted-foreground mt-0.5 flex items-center">
                                        <Play className="h-3 w-3 mr-1" />
                                        {subSection.timeDuration &&
                                          subSection.timeDuration !== "N/A"
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
                  })}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default EnrolledCoursePage;