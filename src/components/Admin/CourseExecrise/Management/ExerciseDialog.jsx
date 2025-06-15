import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileText, ExternalLink, ArrowLeft, Clock, Image, Eye, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ExerciseDialog({
  exercise,
  selectedExercise,
  userAnswers,
  loadingAnswers,
  selectedUser,
  selectedSubmission,
  getUniqueUsers,
  onInspectExercise,
  onOpenUserSubmissions,
  onSetSelectedUser,
}) {
  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          onClick={() => onInspectExercise(exercise)}
          className="ml-4"
        >
          Inspect
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exercise: {selectedExercise?.title}
          </DialogTitle>
          <DialogDescription>
            {selectedUser ? `Submissions by ${selectedUser.firstName} ${selectedUser.lastName}` : 'Student submissions and answers'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[70vh]">
          {loadingAnswers ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-pulse text-muted-foreground">Loading answers...</div>
            </div>
          ) : userAnswers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No submissions found for this exercise.</p>
            </div>
          ) : selectedUser ? (
            // Show detailed submissions for selected user
            <div className="space-y-6">
              <Button
                variant="outline"
                onClick={() => onSetSelectedUser(null)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>

              <div className="space-y-6">
                {selectedSubmission.map((answer) => (
                  <div key={answer._id} className="border rounded-lg p-6 bg-card">
                    {/* Question Section */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <h5 className="font-semibold text-lg">Question</h5>
                        <Badge variant="outline">{answer.question.questionType}</Badge>
                        <Badge variant="secondary">{answer.question.points} point(s)</Badge>
                        <Badge variant={answer.isSubmitted ? "default" : "secondary"}>
                          {answer.isSubmitted ? "Submitted" : "Draft"}
                        </Badge>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-md border-l-4 border-l-primary">
                        <p className="text-foreground">{answer.question.questionText}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Answer Section */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-lg mb-3">Answer</h5>
                      <div className="bg-muted/30 p-4 rounded-md border-l-4 border-l-green-500">
                        <p className="text-foreground">{answer.answerText}</p>
                      </div>
                    </div>

                    {/* Attachment Section */}
                    {answer.attachmentUrl && (
                      <>
                        <Separator className="my-4" />
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Image className="h-5 w-5" />
                            <h5 className="font-semibold text-lg">Attachment</h5>
                          </div>
                          <div className="bg-muted/20 p-4 rounded-md border border-border">
                            <div className="flex flex-col md:flex-row gap-4 items-start">
                              <div className="flex-1 space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-muted-foreground">Format:</span>
                                    <span className="ml-2">{answer.attachment_format?.toUpperCase()}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-muted-foreground">Size:</span>
                                    <span className="ml-2">{(answer.attachment_bytes / 1024).toFixed(2)} KB</span>
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(answer.attachmentUrl, '_blank')}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Original
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => navigate(`canvas/?url=${answer.attachmentUrl}`)}
                                  >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit with Canvas
                                  </Button>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <img
                                  src={answer.attachmentUrl}
                                  alt="Submission attachment"
                                  className="max-w-32 h-32 object-contain rounded border shadow-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Submission Time */}
                    {answer.submittedAt && (
                      <>
                        <Separator className="my-4" />
                        <div className="text-sm text-muted-foreground flex items-center gap-2 bg-muted/30 p-3 rounded">
                          <Clock className="h-4 w-4" />
                          <span><strong>Submitted:</strong> {new Date(answer.submittedAt).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Show user cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getUniqueUsers().map((user) => (
                <Card key={user._id} className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Avatar className="w-16 h-16 mx-auto">
                        <AvatarImage src={user.image} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.firstName[0]}{user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-bold text-lg">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-muted-foreground text-sm">{user.email}</p>
                      </div>

                      <Badge variant="secondary">
                        {user.submissionCount} Submission{user.submissionCount !== 1 ? 's' : ''}
                      </Badge>

                      <Button
                        onClick={() => onOpenUserSubmissions(user)}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Submissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ExerciseDialog;