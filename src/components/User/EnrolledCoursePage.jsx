import { fetchLearningCourse } from "@/redux/api/learningCourseSlice";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Maximize
} from "lucide-react";
import YouTubePlayer from "../Player/YouTubePlayer";

function EnrolledCoursePage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.fetchLearningCourse);
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");
  const [activeSection, setActiveSection] = useState(0);
  const [activeSubSection, setActiveSubSection] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState("");
  const [activeVideoTitle, setActiveVideoTitle] = useState("");
  const [activeVideoDescription, setActiveVideoDescription] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [expandedSections, setExpandedSections] = useState({});
  const [playerState, setPlayerState] = useState({
    playing: false,
    currentTime: 0,
    duration: 0,
    loaded: 0
  });
  const playerRef = useRef(null);

  // Initialize with all sections expanded
  useEffect(() => {
    if (data?.courseDetails?.courseContent) {
      const initialExpanded = {};
      data.courseDetails.courseContent.forEach((section, index) => {
        initialExpanded[index] = true;
      });
      setExpandedSections(initialExpanded);
    }
  }, [data]);

  useEffect(() => {
    dispatch(fetchLearningCourse({ courseId: courseId }));
  }, [courseId, dispatch]);

  useEffect(() => {
    if (data?.courseDetails?.courseContent) {
      // Find first section with subsections
      for (let i = 0; i < data.courseDetails.courseContent.length; i++) {
        const section = data.courseDetails.courseContent[i];
        if (section.subSection && section.subSection.length > 0) {
          setActiveSection(i);
          setActiveSubSection(0);
          const videoUrl = section.subSection[0].videoUrl;
          const videoId = extractYouTubeId(videoUrl);
          setActiveVideoId(videoId);
          setActiveVideoTitle(section.subSection[0].title);
          setActiveVideoDescription(section.subSection[0].description);
          break;
        }
      }
    }
  }, [data]);

  // Extract YouTube ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return "";

    // Handle embed URLs
    if (url.includes('youtube.com/embed/')) {
      const parts = url.split('/');
      return parts[parts.length - 1].split('?')[0];
    }

    // Handle watch URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : "";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <Info className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium">Course data not available</h2>
        <p className="text-muted-foreground mt-2">Please try again later or contact support</p>
      </div>
    );
  }

  const { courseDetails, completedVideos } = data;

  // Calculate course progress
  const totalVideos = courseDetails.courseContent.reduce(
    (acc, section) => acc + (section.subSection?.length || 0), 0
  );
  const progress = totalVideos > 0 ? (completedVideos.length / totalVideos) * 100 : 0;

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleVideoSelection = (sectionIndex, subSectionIndex) => {
    const section = courseDetails.courseContent[sectionIndex];
    const subSection = section.subSection[subSectionIndex];
    const videoId = extractYouTubeId(subSection.videoUrl);

    setActiveSection(sectionIndex);
    setActiveSubSection(subSectionIndex);
    setActiveVideoId(videoId);
    setActiveVideoTitle(subSection.title);
    setActiveVideoDescription(subSection.description);

    // Reset player state
    setPlayerState({
      playing: false,
      currentTime: 0,
      duration: 0,
      loaded: 0
    });
  };

  const navigateToPrevious = () => {
    let newSectionIndex = activeSection;
    let newSubSectionIndex = activeSubSection - 1;

    // If at start of section, go to previous section's last video
    if (newSubSectionIndex < 0) {
      // Loop backward to find previous section with subsections
      for (let i = activeSection - 1; i >= 0; i--) {
        if (courseDetails.courseContent[i].subSection?.length > 0) {
          newSectionIndex = i;
          newSubSectionIndex = courseDetails.courseContent[i].subSection.length - 1;
          break;
        }
      }
    }

    // Only update if we found a valid previous video
    if (newSubSectionIndex >= 0 && courseDetails.courseContent[newSectionIndex].subSection?.[newSubSectionIndex]) {
      handleVideoSelection(newSectionIndex, newSubSectionIndex);
    }
  };

  const navigateToNext = () => {
    let newSectionIndex = activeSection;
    let newSubSectionIndex = activeSubSection + 1;
    const currentSection = courseDetails.courseContent[activeSection];

    // If at end of section, go to next section's first video
    if (!currentSection.subSection || newSubSectionIndex >= currentSection.subSection.length) {
      // Loop forward to find next section with subsections
      for (let i = activeSection + 1; i < courseDetails.courseContent.length; i++) {
        if (courseDetails.courseContent[i].subSection?.length > 0) {
          newSectionIndex = i;
          newSubSectionIndex = 0;
          break;
        }
      }
    }

    // Only update if we found a valid next video
    if (courseDetails.courseContent[newSectionIndex]?.subSection?.[newSubSectionIndex]) {
      handleVideoSelection(newSectionIndex, newSubSectionIndex);
    }
  };


  // YouTube player event handlers
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange = (event) => {
    // Update playing state
    setPlayerState(prev => ({
      ...prev,
      playing: event.data === 1,
    }));

    // Save progress to state every second while playing
    if (event.data === 1) {
      const interval = setInterval(() => {
        if (playerRef.current) {
          setPlayerState(prev => ({
            ...prev,
            currentTime: playerRef.current.getCurrentTime(),
            duration: playerRef.current.getDuration(),
            loaded: playerRef.current.getVideoLoadedFraction() * 100
          }));
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    // Video ended - mark as completed and maybe navigate to next
    if (event.data === 0) {
      // TODO: Here you would dispatch an action to mark video as completed
      // dispatch(markVideoAsCompleted({ courseId, videoId: activeVideoId }));

      // Auto navigate to next video if available
      if (!isNextDisabled()) {
        navigateToNext();
      }
    }
  };

  // Custom player controls
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
    if (playerRef.current) {
      playerRef.current.getIframe().requestFullscreen();
    }
  };

  const formatDescription = (text) => {
    if (!text) return "";
    return text.split('\n').map((line, i) => (
      <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
    ));
  };

  // Check if navigation buttons should be disabled
  const isPreviousDisabled = () => {
    if (activeSubSection > 0) return false;

    // Check if there are any previous sections with videos
    for (let i = activeSection - 1; i >= 0; i--) {
      if (courseDetails.courseContent[i].subSection?.length > 0) {
        return false;
      }
    }
    return true;
  };

  const isNextDisabled = () => {
    const currentSection = courseDetails.courseContent[activeSection];
    if (currentSection.subSection && activeSubSection < currentSection.subSection.length - 1) return false;

    // Check if there are any next sections with videos
    for (let i = activeSection + 1; i < courseDetails.courseContent.length; i++) {
      if (courseDetails.courseContent[i].subSection?.length > 0) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="container mx-auto px-2 py-4 md:px-4 lg:px-6 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main content area - Video player and details */}
        <div className="lg:col-span-2 order-1">
          <Card className="mb-6 shadow-sm overflow-hidden">
            <div className="aspect-video bg-black relative overflow-hidden w-full">
              {activeVideoId ? (
                <div className="relative w-full h-full">
                  <YouTubePlayer
                    videoId={activeVideoId}
                    onEnd={navigateToNext}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                  />


                  {/* Custom video controls overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between items-center text-white opacity-0 transition-opacity hover:opacity-100">
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
                        {Math.floor(playerState.currentTime % 60).toString().padStart(2, '0')} /
                        {Math.floor(playerState.duration / 60)}:
                        {Math.floor(playerState.duration % 60).toString().padStart(2, '0')}
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
                <div className="flex h-full items-center justify-center bg-muted">
                  <div className="text-center p-6">
                    <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Select a lesson to start learning</p>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4 lg:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-1">{activeVideoTitle || courseDetails.courseName}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {activeVideoDescription || "Select a lesson to view its description"}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <UserSquare className="h-4 w-4 mr-1" />
                  {courseDetails.instructor.firstName} {courseDetails.instructor.lastName}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {courseDetails.category.name}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {data.totalDuration && data.totalDuration !== "NaNs" ? data.totalDuration : "Self-paced"}
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
                      <h3 className="text-lg font-medium mb-3">Course Description</h3>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {formatDescription(courseDetails.courseDescription)}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-lg font-medium mb-3">What You&apos;ll Learn</h3>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {formatDescription(courseDetails.whatYouWillLearn)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="instructions" className="mt-2">
                  <h3 className="text-lg font-medium mb-3">Course Instructions</h3>
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
                {totalVideos} {totalVideos === 1 ? 'lesson' : 'lessons'}
              </div>
            </div>
            <CardContent className="p-0">
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your progress</span>
                    <span>{completedVideos.length} / {totalVideos} completed</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <ScrollArea className="h-[calc(100vh-220px)]  pr-4">
                  {courseDetails.courseContent.map((section, sectionIndex) => {
                    const hasSubSections = section.subSection && section.subSection.length > 0;
                    return (
                      <div key={section._id} className="mb-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-between items-center p-3 h-auto text-left font-medium hover:bg-secondary"
                          onClick={() => toggleSection(sectionIndex)}
                        >
                          <div className="flex items-center">
                            <span>{sectionIndex + 1}. {section.sectionName}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            {hasSubSections ? `${section.subSection.length} lessons` : 'No lessons'}
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
                                  key={subSection._id}
                                  variant="ghost"
                                  className={`w-full justify-start py-2 px-3 h-auto text-left ${isActive ? "bg-secondary" : ""
                                    }`}
                                  onClick={() => handleVideoSelection(sectionIndex, subIndex)}
                                >
                                  <div className="flex items-start">
                                    {isCompleted ? (
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{subSection.title}</span>
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