import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Pen, BookOpen, GraduationCap, Milestone, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function CourseContent({ courseContent, instructions }) {
  return (
    <div className="mb-36">
      <div className="flex flex-col md:flex-row w-full gap-6 p-6">
        {/* Course Content Section */}
        <Card className="flex-1 shadow-lg border-0">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Course Content
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-3">
              {courseContent.map((section) => (
                <AccordionItem
                  key={section._id}
                  value={section._id}
                  className="border rounded-lg transition-colors duration-200 overflow-hidden"
                >
                  <AccordionTrigger className="px-4 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 flex items-center justify-center border rounded-md bg-muted">
                        <Book className="w-4 h-4" />
                      </div>
                      <span className="text-lg font-semibold">{section.sectionName}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      {section.subSection.length > 0 ? (
                        section.subSection.map((sub) => (
                          <Card
                            key={sub._id}
                            className="p-4 hover:bg-muted/50 transition-colors duration-200 border-l-4 border-l-purple-500"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1 bg-purple-100 rounded">
                                <Pen className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="font-medium text-lg text-purple-600">
                                {sub.title}
                              </span>
                            </div>
                            <p className="ml-7 text-muted-foreground">{sub.description}</p>
                          </Card>
                        ))
                      ) : (
                        <p className="text-muted-foreground italic ml-8">No Content</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card className="flex-1 h-fit shadow-lg border-0">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Instructions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-1 bg-primary/10 rounded-full mt-1">
                      <Milestone className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm leading-relaxed">{instruction}</p>
                  </div>
                  {index < instructions.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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