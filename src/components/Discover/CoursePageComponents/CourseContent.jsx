import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Pen, BookOpen, GraduationCap, Milestone, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CourseContent({ courseContent, instructions }) {
  return (
    <div className="mb-36">
      <div className="flex flex-col md:flex-row w-full">
        {/* Course Content Section */}
        <Card className="bg-transparent border-none rounded-none flex-1 shadow-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
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
                  className="border rounded-lg transition-colors duration-200"
                >
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 flex items-center justify-center border rounded-md">
                        <Book className="w-4 h-4" />
                      </div>
                      <span className="text-lg font-semibold">{section.sectionName}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-4">
                      {section.subSection.length > 0 ? (
                        section.subSection.map((sub) => (
                          <div
                            key={sub._id}
                            className="p-4 rounded-lg border hover:bg-gray-200 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Pen className="w-4 h-4 text-purple-600" />
                              <span className="font-medium text-lg text-purple-600">
                                {sub.title}
                              </span>
                            </div>
                            <p className="ml-6">{sub.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic ml-8">No Content</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card className="flex-1 bg-transparent rounded-none border-none h-fit shadow-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Instructions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {instructions.map((instruction, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3">
                    <Milestone className="w-6 h-6 flex-shrink-0" />
                    <p>{instruction}</p>
                  </div>
                  <div className='border-b mt-2'></div>
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
