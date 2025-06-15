import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BookOpen, Users, Clock, FileText } from 'lucide-react';
import CourseHeader from './CourseHeader';
import ExerciseDialog from './ExerciseDialog';

function ExerciseManagement() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('id');

  const [error, setError] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/courses/getFullCourseDetails`,
          { courseId: courseId },
          { withCredentials: true }
        );
        setCourseDetails(response.data.data.courseDetails);
      } catch (err) {
        setError("Failed to fetch course details");
        console.error("Error fetching course details:", err);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchUserAnswers = async (exerciseId) => {
    setLoadingAnswers(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/exercise/getUserAnswers?exerciseId=${exerciseId}`, {},
        { withCredentials: true }
      );
      setUserAnswers(response.data.answers || []);
    } catch (err) {
      console.error("Error fetching user answers:", err);
      setUserAnswers([]);
    } finally {
      setLoadingAnswers(false);
    }
  };

  const handleInspectExercise = (exercise) => {
    setSelectedExercise(exercise);
    fetchUserAnswers(exercise._id);
    setSelectedUser(null);
    setSelectedSubmission(null);
  };

  const handleOpenUserSubmissions = (user) => {
    const userSubmissions = userAnswers.filter(answer => answer.user._id === user._id);
    setSelectedUser(user);
    setSelectedSubmission(userSubmissions);
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Group users by their unique IDs to avoid duplicates
  const getUniqueUsers = () => {
    const userMap = new Map();
    userAnswers.forEach(answer => {
      if (!userMap.has(answer.user._id)) {
        userMap.set(answer.user._id, {
          ...answer.user,
          submissionCount: userAnswers.filter(a => a.user._id === answer.user._id).length
        });
      }
    });
    return Array.from(userMap.values());
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-semibold">Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Course Header Component */}
        <CourseHeader courseDetails={courseDetails} />

        {/* What You'll Learn */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              What You'll Learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{courseDetails.whatYouWillLearn}</p>
          </CardContent>
        </Card>

        {/* Course Sections */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Course Sections
          </h2>

          <div className="grid gap-4">
            {courseDetails.courseContent.map((section, index) => (
              <Card key={section._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Section {index + 1}: {section.sectionName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {section.subSection.length} Lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {section.exercises?.length || 0} Exercises
                        </span>
                      </CardDescription>
                    </div>

                    {section.exercises && section.exercises.length > 0 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            View Exercises
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-6xl max-h-[90vh]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Exercises for {section.sectionName}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Review and inspect student submissions for this section's exercises.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {section.exercises.map((exercise) => (
                              <Card key={exercise._id} className="border-l-4 border-l-primary">
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-lg">{exercise.title}</h4>
                                      <p className="text-muted-foreground mt-1">
                                        {truncateText(exercise.description)}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Created: {new Date(exercise.createdAt).toLocaleDateString()}</span>
                                      </div>
                                    </div>

                                    <ExerciseDialog
                                      exercise={exercise}
                                      selectedExercise={selectedExercise}
                                      userAnswers={userAnswers}
                                      loadingAnswers={loadingAnswers}
                                      selectedUser={selectedUser}
                                      selectedSubmission={selectedSubmission}
                                      getUniqueUsers={getUniqueUsers}
                                      onInspectExercise={handleInspectExercise}
                                      onOpenUserSubmissions={handleOpenUserSubmissions}
                                      onSetSelectedUser={setSelectedUser}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseManagement;
