import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Play,
  CheckCircle,
  Circle,
  BookOpen,
  Info,
  FileText,
  PenTool,
} from "lucide-react";

function CourseContentSidebar({
  courseContent,
  activeSection,
  activeSubSection,
  completedVideos,
  progressPercentage,
  onVideoSelection,
  onExerciseSelection,
}) {
  const [expandedSections, setExpandedSections] = useState(() => {
    const initialExpanded = {};
    courseContent?.forEach((section, index) => {
      initialExpanded[index] = true;
    });
    return initialExpanded;
  });

  const totalVideos = courseContent?.reduce(
    (acc, section) => acc + (section?.subSection?.length || 0),
    0
  ) || 0;

  const totalExercises = courseContent?.reduce(
    (acc, section) => acc + (section?.exercises?.length || 0),
    0
  ) || 0;

  const totalContent = totalVideos + totalExercises;

  const toggleSection = (sectionIndex) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  const renderSectionContent = (section, sectionIndex) => {
    const subSections = section?.subSection || [];
    const exercises = section?.exercises || [];

    // Combine and sort content by creation date or maintain original order
    const allContent = [
      ...subSections.map(item => ({ ...item, type: 'lesson' })),
      ...exercises.map(item => ({ ...item, type: 'exercise' }))
    ];

    if (allContent.length === 0) {
      return (
        <div className="pl-2 sm:pl-4 mt-2 mb-2">
          <div className="flex items-center justify-center p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground bg-muted/30 rounded-md">
            <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span>Content coming soon</span>
          </div>
        </div>
      );
    }

    return (
      <div className="pl-2 sm:pl-4 mt-1 space-y-1 sm:space-y-2">
        {allContent.map((item, index) => {
          if (item.type === 'lesson') {
            const subIndex = subSections.findIndex(sub => sub._id === item._id);
            const isActive = sectionIndex === activeSection && subIndex === activeSubSection;
            const isCompleted = completedVideos.includes(item._id);

            return (
              <Button
                key={`lesson-${item._id}`}
                variant="ghost"
                className={`w-full border justify-start py-2 px-2 sm:px-3 h-auto text-left min-h-[3rem] sm:min-h-[3.5rem] ${isActive ? "bg-muted" : ""
                  }`}
                onClick={() => onVideoSelection(sectionIndex, subIndex)}
              >
                <div className="flex  items-start w-full gap-2">
                  {isCompleted ? (
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex  flex-col text-left flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-medium leading-tight line-clamp-2">
                      {item.title || "Untitled Lesson"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Play className="h-2 w-2 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {item.timeDuration && item.timeDuration !== "N/A"
                          ? item.timeDuration
                          : "Video"}
                      </span>
                    </span>
                  </div>
                </div>
              </Button>
            );
          } else if (item.type === 'exercise') {
            return (
              <div
                key={`exercise-${item._id}`}
                className="w-full border rounded-md p-2 sm:p-3  hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex items-start flex-1 min-w-0 gap-2">
                    <PenTool className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col text-left flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-blue-900 line-clamp-2">
                        {item.title || "Untitled Exercise"}
                      </span>

                      <span className="text-xs text-blue-600 mt-1 flex items-center">
                        <FileText className="h-2 w-2 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {item.questions?.length || 0} {(item.questions?.length || 0) === 1 ? "question" : "questions"}
                        </span>
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-1 text-foreground border-blue-200 hover:border-blue-300 text-xs px-2 sm:px-3 py-1 flex-shrink-0"
                    onClick={() => onExerciseSelection(item._id, item)}
                  >
                    Start
                  </Button>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <Card className="h-full border">
      <div className="p-3 sm:p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-base sm:text-lg">Course Content</h3>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground flex items-center flex-wrap gap-1">
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span>{totalVideos} {totalVideos === 1 ? "lesson" : "lessons"}</span>
          </div>
          {totalExercises > 0 && (
            <>
              <span className="mx-1">•</span>
              <div className="flex items-center">
                <PenTool className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>{totalExercises} {totalExercises === 1 ? "exercise" : "exercises"}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <CardContent className="p-0">
        <div className="p-3 sm:p-4">
          <div className="mb-4">
            <div className="flex justify-between text-xs sm:text-sm mb-2">
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

          <ScrollArea className="h-[calc(100vh-280px)] sm:h-[calc(100vh-220px)] pr-2 sm:pr-4">
            {courseContent?.map((section, sectionIndex) => {
              const hasContent = (section?.subSection && section.subSection.length > 0) ||
                (section?.exercises && section.exercises.length > 0);
              const contentCount = (section?.subSection?.length || 0) + (section?.exercises?.length || 0);

              return (
                <div key={section._id || sectionIndex} className="mb-3 sm:mb-4">
                  <Button
                    variant="ghost"
                    className="w-full border justify-between items-start p-2 sm:p-3 h-auto text-left font-medium hover:bg-muted/50"
                    onClick={() => toggleSection(sectionIndex)}
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <span className="text-xs sm:text-sm font-medium line-clamp-2">
                        {sectionIndex + 1}. {section.sectionName || "Untitled Section"}
                      </span>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center flex-wrap gap-1">
                        {hasContent ? (
                          <>
                            <span>{section?.subSection?.length || 0} lessons</span>
                            {(section?.exercises?.length || 0) > 0 && (
                              <span>, {section.exercises.length} exercises</span>
                            )}
                          </>
                        ) : (
                          <span>No content</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 transition-transform ${expandedSections[sectionIndex] ? "rotate-90" : ""
                        }`}
                    />
                  </Button>

                  {expandedSections[sectionIndex] && renderSectionContent(section, sectionIndex)}
                </div>
              );
            }) || (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  <Info className="h-4 w-4 mr-2" />
                  <span className="text-sm">No course content available</span>
                </div>
              )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseContentSidebar;