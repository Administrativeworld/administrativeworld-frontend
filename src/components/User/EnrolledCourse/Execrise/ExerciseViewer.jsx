import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PenTool,
  CheckCircle,
  ArrowLeft,
  Save,
  Send,
  FileText,
  Upload,
  X,
  AlertCircle,
  Trophy,
  Clock,
  Eye,
  ExternalLink
} from "lucide-react";
import axios from 'axios';

const ExerciseViewer = ({
  exerciseId,
  onBackToLesson,
  userId,
  courseId
}) => {
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [savedAnswers, setSavedAnswers] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attachments, setAttachments] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [error, setError] = useState(null);

  // New state for dialogs
  const [attachmentDialog, setAttachmentDialog] = useState({ open: false, attachment: null });
  const [uploadConfirmDialog, setUploadConfirmDialog] = useState({ open: false, file: null, questionId: null });

  // Toast-like notification function (since we can't import react-hot-toast)
  const showNotification = (message, type = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    // You can replace this with your preferred notification system
  };

  // Fetch exercise data with error handling
  const fetchExercise = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/exercise/getExercise?exerciseId=${exerciseId}`,
        { credentials: 'include' }
      );
      const data = await response.json();

      if (data.success) {
        setExercise(data.exercise);
        await fetchUserAnswers();
      } else {
        setError(data.message || 'Failed to load exercise');
      }
    } catch (error) {
      console.error("Error fetching exercise:", error);
      setError(error.message || 'Failed to load exercise');
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing user answers - Fixed to use GET method
  const fetchUserAnswers = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/exercise/getUserAnswers?exerciseId=${exerciseId}`, {}, { withCredentials: true })
      console.log("GET ANSWERS", response)
      const data = await response.data;

      if (response.status === 200) {
        const answers = {};
        const saved = {};
        const submitted = new Set();
        const attachmentData = {};

        data.answers.forEach(answer => {
          const questionId = answer.question._id || answer.question;

          answers[questionId] = answer.answerText || '';
          saved[questionId] = answer.answerText || '';

          if (answer.isSubmitted) {
            submitted.add(questionId);
          }

          if (answer.attachmentUrl) {
            attachmentData[questionId] = {
              url: answer.attachmentUrl,
              publicId: answer.attachment_public_id,
              format: answer.attachment_format,
              bytes: answer.attachment_bytes,
              resourceType: answer.attachment_resource_type
            };
          }
        });

        setUserAnswers(answers);
        setSavedAnswers(saved);
        setSubmittedQuestions(submitted);
        setAttachments(attachmentData);
      }
    } catch (error) {
      console.error("Error fetching user answers:", error);
      // Don't show error for user answers as it might be first time
    }
  };

  // Submit answer - Updated to use correct endpoint and parameters
  const submitAnswer = async (questionId, answerText, isSubmit = false, attachmentData = null) => {
    try {
      setIsSaving(!isSubmit);
      setIsSubmitting(isSubmit);

      const payload = {
        answerText: answerText.trim(),
        isSubmitted: isSubmit
      };

      // Add attachment data if provided
      if (attachmentData) {
        payload.attachmentUrl = attachmentData.url;
        payload.attachment_public_id = attachmentData.publicId;
        payload.attachment_format = attachmentData.format;
        payload.attachment_bytes = attachmentData.bytes;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/exercise/submitAnswer/${exerciseId}/${questionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        }
      );
      const data = await response.json();

      if (data.success) {
        setSavedAnswers(prev => ({ ...prev, [questionId]: answerText }));

        if (isSubmit) {
          setSubmittedQuestions(prev => new Set([...prev, questionId]));
          showNotification("Answer submitted successfully!", 'success');
        } else {
          showNotification("Answer saved as draft", 'success');
        }
        return true;
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      showNotification(error.message || "Failed to save answer", 'error');
      return false;
    } finally {
      setIsSaving(false);
      setIsSubmitting(false);
    }
  };

  // Handle file selection and show confirmation dialog
  const handleFileSelection = (questionId, file) => {
    setUploadConfirmDialog({
      open: true,
      file: file,
      questionId: questionId
    });
  };

  // Confirm file upload
  const confirmFileUpload = async () => {
    const { file, questionId } = uploadConfirmDialog;
    setUploadConfirmDialog({ open: false, file: null, questionId: null });

    if (file && questionId) {
      await handleFileUpload(questionId, file);
    }
  };

  // Cancel file upload
  const cancelFileUpload = () => {
    setUploadConfirmDialog({ open: false, file: null, questionId: null });
  };

  // Handle file upload - Simplified version (you'll need to implement file upload endpoint)
  const handleFileUpload = async (questionId, file) => {
    try {
      setUploadingFiles(prev => ({ ...prev, [questionId]: true }));

      // Check if file is image or PDF
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';

      if (!isImage && !isPDF) {
        showNotification("Only image files and PDFs are allowed", 'error');
        setUploadingFiles(prev => ({ ...prev, [questionId]: false }));
        return;
      }

      // Validate file size (max 10MB for PDFs, 5MB for images)
      const maxImageSize = 5 * 1024 * 1024; // 5MB
      const maxPDFSize = 10 * 1024 * 1024; // 10MB
      const maxSize = isImage ? maxImageSize : maxPDFSize;

      if (file.size > maxSize) {
        const sizeMB = Math.round(maxSize / (1024 * 1024));
        showNotification(`File size must be less than ${sizeMB}MB`, 'error');
        setUploadingFiles(prev => ({ ...prev, [questionId]: false }));
        return;
      }
      const resourceType = isImage ? 'image' : 'raw';
      const { data: signatureData } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/generate/generateSignature`,
        {
          uploadPreset: "answers_attachments",
          resourceType: resourceType // ✅ Include resourceType in signature request
        }
      );

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      cloudinaryFormData.append("upload_preset", 'answers_attachments');
      cloudinaryFormData.append("resource_type", resourceType);
      cloudinaryFormData.append("timestamp", signatureData.timestamp);
      cloudinaryFormData.append("signature", signatureData.signature);

      // Optional: Add 
      // Set resource type based on file type


      // Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: cloudinaryFormData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const cloudinaryResult = await response.json();

      // Create attachment object with Cloudinary data
      const attachment = {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes,
        resourceType: cloudinaryResult.resource_type,
        originalFilename: file.name,
        width: cloudinaryResult.width || null, // Only for images
        height: cloudinaryResult.height || null, // Only for images
        createdAt: cloudinaryResult.created_at,
        fileType: isImage ? 'image' : 'pdf'
      };

      // Update local state with attachment
      setAttachments(prev => ({
        ...prev,
        [questionId]: attachment
      }));

      // Auto-save the current answer with the new attachment
      const currentAnswer = userAnswers[questionId] || '';
      if (currentAnswer.trim()) {
        await submitAnswer(questionId, currentAnswer, false, attachment);
      }

      showNotification("File uploaded successfully!", 'success');

    } catch (error) {
      console.error("Error uploading file:", error);
      showNotification(error.message || "Failed to upload file", 'error');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Remove attachment
  const removeAttachment = (questionId) => {
    setAttachments(prev => {
      const newAttachments = { ...prev };
      delete newAttachments[questionId];
      return newAttachments;
    });
    showNotification("Attachment removed", 'success');
  };

  // Open attachment in dialog
  const openAttachment = (attachment) => {
    setAttachmentDialog({ open: true, attachment });
  };

  // Close attachment dialog
  const closeAttachmentDialog = () => {
    setAttachmentDialog({ open: false, attachment: null });
  };

  // Handle answer change
  const handleAnswerChange = (questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Auto-save functionality (save draft every 30 seconds if there are changes)
  useEffect(() => {
    if (!exercise) return;

    const interval = setInterval(() => {
      const currentQuestion = exercise.questions[currentQuestionIndex];
      if (!currentQuestion) return;

      const currentAnswer = userAnswers[currentQuestion._id] || '';
      const savedAnswer = savedAnswers[currentQuestion._id] || '';
      const isSubmitted = submittedQuestions.has(currentQuestion._id);

      if (currentAnswer.trim() && currentAnswer !== savedAnswer && !isSubmitted) {
        submitAnswer(currentQuestion._id, currentAnswer, false);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [exercise, currentQuestionIndex, userAnswers, savedAnswers, submittedQuestions]);

  useEffect(() => {
    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-xl font-medium mb-2">
          {error || 'Exercise not found'}
        </h2>
        <p className="text-muted-foreground mb-4 text-center max-w-md">
          {error || 'Please try again later or contact support.'}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchExercise}>
            Try Again
          </Button>
          <Button onClick={onBackToLesson}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lesson
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = exercise.questions[currentQuestionIndex];
  const totalQuestions = exercise.questions.length;
  const completedQuestions = submittedQuestions.size;
  const progressPercentage = (completedQuestions / totalQuestions) * 100;
  const totalPoints = exercise.questions.reduce((sum, q) => sum + (q.points || 0), 0);

  const isCurrentQuestionSubmitted = submittedQuestions.has(currentQuestion._id);
  const currentAnswer = userAnswers[currentQuestion._id] || '';
  const hasUnsavedChanges = currentAnswer !== (savedAnswers[currentQuestion._id] || '');

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBackToLesson}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lesson
          </Button>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            {totalPoints} Points Total
          </Badge>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <PenTool className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{exercise.title}</h1>
            {exercise.description && (
              <p className="text-muted-foreground mt-1">{exercise.description}</p>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">
              {completedQuestions} of {totalQuestions} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Question Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Questions</h2>
          <div className="flex gap-2 flex-wrap">
            {exercise.questions.map((question, index) => (
              <button
                key={question._id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors ${index === currentQuestionIndex
                  ? 'bg-primary text-primary-foreground border-primary'
                  : submittedQuestions.has(question._id)
                    ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300'
                    : 'bg-background border-muted-foreground/30 hover:border-muted-foreground'
                  }`}
                title={`Question ${index + 1}${submittedQuestions.has(question._id) ? ' (Submitted)' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline">Question {currentQuestionIndex + 1}</Badge>
                <Badge variant="secondary">{currentQuestion.points} Points</Badge>
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.questionType}
                </Badge>
                {isCurrentQuestionSubmitted && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Submitted
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-medium leading-relaxed">
                {currentQuestion.questionText}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Answer Textarea */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Answer</label>
            <Textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[150px] resize-y"
              disabled={isCurrentQuestionSubmitted}
            />
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>{currentAnswer.length} characters</span>
              {hasUnsavedChanges && !isCurrentQuestionSubmitted && (
                <span className="flex items-center gap-1 text-amber-600">
                  <Clock className="h-3 w-3" />
                  Unsaved changes
                </span>
              )}
            </div>
          </div>

          {/* File Attachment */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Attachment (Optional)</label>
            {attachments[currentQuestion._id] ? (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">
                    Attachment ({Math.round(attachments[currentQuestion._id].bytes / 1024)} KB)
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openAttachment(attachments[currentQuestion._id])}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Open
                  </Button>
                  {!isCurrentQuestionSubmitted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(currentQuestion._id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              !isCurrentQuestionSubmitted && (
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload an image or document to support your answer
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileSelection(currentQuestion._id, file);
                    }}
                    className="hidden"
                    id={`file-${currentQuestion._id}`}
                    disabled={uploadingFiles[currentQuestion._id]}
                  />
                  <label
                    htmlFor={`file-${currentQuestion._id}`}
                    className="inline-flex items-center px-3 py-2 border border-muted-foreground/30 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors"
                  >
                    {uploadingFiles[currentQuestion._id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      'Choose File'
                    )}
                  </label>
                </div>
              )
            )}
          </div>

          {/* Unsaved Changes Alert */}
          {hasUnsavedChanges && !isCurrentQuestionSubmitted && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes. Save your answer to avoid losing your work.
                Auto-save will occur in 30 seconds.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.min(totalQuestions - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === totalQuestions - 1}
              >
                Next
              </Button>
            </div>

            <div className="flex gap-2">
              {!isCurrentQuestionSubmitted && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => submitAnswer(currentQuestion._id, currentAnswer, false)}
                    disabled={isSaving || !currentAnswer.trim()}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => submitAnswer(currentQuestion._id, currentAnswer, true)}
                    disabled={isSubmitting || !currentAnswer.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Answer
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Summary */}
      {completedQuestions === totalQuestions && (
        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
              Exercise Completed!
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              You've successfully submitted all {totalQuestions} questions for a total of {totalPoints} points.
            </p>
            <Button onClick={onBackToLesson}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Attachment Dialog */}
      <AlertDialog open={attachmentDialog.open} onOpenChange={closeAttachmentDialog}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Attachment Viewer
            </AlertDialogTitle>
            <AlertDialogDescription>
              {attachmentDialog.attachment?.originalFilename || 'Attachment'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex-1 overflow-auto">
            {attachmentDialog.attachment && (
              <div className="w-full h-full">
                {attachmentDialog.attachment.fileType === 'image' ? (
                  <img
                    src={attachmentDialog.attachment.url}
                    alt="Attachment"
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">PDF Document</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {attachmentDialog.attachment.originalFilename}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Size: {Math.round(attachmentDialog.attachment.bytes / 1024)} KB
                    </p>
                    <Button
                      onClick={() => window.open(attachmentDialog.attachment.url, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in New Tab
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAttachmentDialog}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Confirmation Dialog */}
      <AlertDialog open={uploadConfirmDialog.open} onOpenChange={cancelFileUpload}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm File Upload</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to upload "{uploadConfirmDialog.file?.name}"?
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                File size: {uploadConfirmDialog.file ? Math.round(uploadConfirmDialog.file.size / 1024) : 0} KB
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelFileUpload}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFileUpload}>Upload</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExerciseViewer;