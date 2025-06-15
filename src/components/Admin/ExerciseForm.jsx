import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BookOpen,
  FileText,
  Save,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

const ExerciseForm = ({ open, onClose, onSubmit, course, onBack }) => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sectionId: "",
    questions: [
      {
        questionText: "",
        questionType: "long-answer",
        points: 5
      }
    ]
  });

  // Fetch course details when course is selected
  useEffect(() => {
    if (course && course._id) {
      fetchCourseDetails(course._id);
    }
  }, [course]);

  const fetchCourseDetails = async (courseId) => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/courses/getFullCourseDetails`,
        { courseId: courseId }, { withCredentials: true }
      );
      setCourseDetails(response.data.data.courseDetails
      );
    } catch (err) {
      setError("Failed to fetch course details");
      console.error("Error fetching course details:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = formData.questions.map((question, i) =>
      i === index ? { ...question, [field]: value } : question
    );
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          questionType: "long-answer",
          points: 5
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.sectionId) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.questions.some(q => !q.questionText.trim())) {
      setError("Please fill in all question texts");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Submit exercise data
      await onSubmit(formData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        sectionId: "",
        questions: [
          {
            questionText: "",
            questionType: "long-answer",
            points: 5
          }
        ]
      });
    } catch (err) {
      setError("Failed to create exercise");
      console.error("Error creating exercise:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const questionTypes = [
    { value: "long-answer", label: "Long Answer" },
    { value: "short-answer", label: "Short Answer" },
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "true-false", label: "True/False" }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <DialogTitle className="text-2xl font-bold">Create Exercise</DialogTitle>
              <DialogDescription>
                Create a new exercise for: <span className="font-semibold">{course?.courseName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Loading course details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Course Name</Label>
                    <p className="text-sm text-gray-600">{course?.courseName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <Badge variant="secondary">{course?.category?.name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Exercise Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Exercise Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter exercise title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe what this exercise covers"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="section">Select Section *</Label>
                  <Select
                    value={formData.sectionId}
                    onValueChange={(value) => handleInputChange("sectionId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseDetails?.courseContent?.map((section) => (
                        <SelectItem key={section._id} value={section._id}>
                          {section.sectionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Questions</CardTitle>
                  <Button type="button" onClick={addQuestion} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.questions.map((question, index) => (
                  <Card key={index} className="border-l-4 border-l-primary/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        {formData.questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Question Text *</Label>
                        <Textarea
                          value={question.questionText}
                          onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                          placeholder="Enter your question"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Question Type</Label>
                          <Select
                            value={question.questionType}
                            onValueChange={(value) => handleQuestionChange(index, "questionType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {questionTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Points</Label>
                          <Input
                            type="number"
                            value={question.points}
                            onChange={(e) => handleQuestionChange(index, "points", parseInt(e.target.value) || 0)}
                            min="1"
                            max="100"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Exercise
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseForm;