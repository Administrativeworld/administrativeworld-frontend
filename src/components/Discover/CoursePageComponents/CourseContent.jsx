import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  BookOpen,
  GraduationCap,
  Book,
  PlayCircle,
  FileText,
  Eye,
  List
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function CourseContent({ courseContent, instructions }) {
  const totalSections = courseContent.length;
  const totalSubSections = courseContent.reduce((acc, section) => acc + section.subSection.length, 0);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Course Content Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      Course Content
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {totalSections} sections • {totalSubSections} lessons
                    </p>
                  </div>
                </div>

                {/* View All Content Alert Dialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-4xl max-h-[80vh]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Complete Course Content</AlertDialogTitle>
                      <AlertDialogDescription>
                        Detailed overview of all course sections and lessons
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <ScrollArea className="max-h-96">
                      <div className="space-y-4 pr-4">
                        {courseContent.map((section, sectionIndex) => (
                          <div key={section._id} className="space-y-2">
                            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                              <Badge variant="secondary" className="text-xs">
                                {sectionIndex + 1}
                              </Badge>
                              <h4 className="font-semibold">{section.sectionName}</h4>
                            </div>
                            {section.subSection.map((sub, subIndex) => (
                              <div key={sub._id} className="ml-6 p-2 border-l-2 border-muted">
                                <div className="flex items-start gap-2">
                                  <Badge variant="outline" className="text-xs mt-0.5">
                                    {subIndex + 1}
                                  </Badge>
                                  <div>
                                    <p className="font-medium text-sm">{sub.title}</p>
                                    <p className="text-xs text-muted-foreground">{sub.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <AlertDialogFooter>
                      <AlertDialogAction>Close</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>

            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {courseContent.map((section, index) => (
                  <AccordionItem
                    key={section._id}
                    value={section._id}
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Badge variant="secondary" className="text-xs">
                          {index + 1}
                        </Badge>
                        <div className="p-2 bg-primary/10 rounded">
                          <Book className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-semibold">{section.sectionName}</span>
                          <p className="text-xs text-muted-foreground mt-1">
                            {section.subSection.length} lesson{section.subSection.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {section.subSection.length > 0 ? (
                          section.subSection.map((sub, subIndex) => (
                            <Card
                              key={sub._id}
                              className="p-4 hover:bg-muted/30 transition-colors border-l-4 border-l-primary/30"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {subIndex + 1}
                                  </Badge>
                                  <div className="p-1 bg-primary/10 rounded">
                                    <PlayCircle className="w-4 h-4 text-primary" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-primary mb-1">
                                    {sub.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {sub.description}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))
                        ) : (
                          <div className="flex items-center justify-center py-8 text-muted-foreground">
                            <FileText className="w-5 h-5 mr-2" />
                            <span className="italic">No content available</span>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Section - Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 sticky top-4">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      Instructions
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {instructions.length} guideline{instructions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Instructions Alert Dialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <List className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Course Instructions</AlertDialogTitle>
                      <AlertDialogDescription>
                        Complete list of course guidelines and instructions
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <ScrollArea className="max-h-96">
                      <div className="space-y-4 pr-4">
                        {instructions.map((instruction, index) => (
                          <div key={index} className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-start gap-3">
                              <Badge variant="secondary" className="text-xs mt-0.5">
                                {index + 1}
                              </Badge>
                              <p className="text-sm leading-relaxed">{instruction}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <AlertDialogFooter>
                      <AlertDialogAction>Close</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {instructions.slice(0, 3).map((instruction, index) => (
                  <div key={index}>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <Badge variant="secondary" className="text-xs mt-0.5">
                        {index + 1}
                      </Badge>
                      <p className="text-sm leading-relaxed line-clamp-2">
                        {instruction}
                      </p>
                    </div>
                    {index < Math.min(instructions.length - 1, 2) && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}

                {instructions.length > 3 && (
                  <div className="pt-2">
                    <Badge variant="outline" className="w-full justify-center py-2">
                      +{instructions.length - 3} more instructions
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

CourseContent.propTypes = {
  courseContent: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      sectionName: PropTypes.string.isRequired,
      subSection: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  instructions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CourseContent;