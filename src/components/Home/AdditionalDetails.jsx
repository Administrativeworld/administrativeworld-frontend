import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Book,
  Trophy,
  Users,
  Target,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Bookmark
} from 'lucide-react';



const achievements = [
  { number: "10,000+", label: "Students Enrolled" },
  { number: "500+", label: "Selections" },
  { number: "50+", label: "Expert Mentors" },
  { number: "95%", label: "Success Rate" }
];

const AdditionalDetails = () => {


  return (
    <div className="space-y-8 py-4 sm:py-8">

      {/* Achievements Section */}
      <section className="w-full px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-4 sm:pt-6">
                  <p className="text-xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{achievement.number}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{achievement.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Tabs Section */}
      <section className="w-full px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="courses" className="w-full">
            <div className="overflow-hidden">
              <TabsList className="w-full flex">
                <TabsTrigger value="courses" className="flex-1">Courses</TabsTrigger>
                <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
                <TabsTrigger value="schedule" className="flex-1">Schedule</TabsTrigger>
                <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Our Courses</CardTitle>
                  <CardDescription className="text-sm">Comprehensive preparation for UPSC and other competitive exams</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Book className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Foundation Course</h4>
                      <p className="text-sm text-gray-600">Complete syllabus coverage with basic to advanced concepts</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Test Series</h4>
                      <p className="text-sm text-gray-600">Regular mock tests with detailed analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Key Features</CardTitle>
                  <CardDescription className="text-sm">What makes us unique</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <GraduationCap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Expert Faculty</h4>
                      <p className="text-sm text-gray-600">Learn from experienced mentors and successful candidates</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Proven Track Record</h4>
                      <p className="text-sm text-gray-600">Consistent results in UPSC examinations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Class Schedule</CardTitle>
                  <CardDescription className="text-sm">Flexible timing for better learning</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Regular Batches</h4>
                      <p className="text-sm text-gray-600">Morning and evening batches available</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Bookmark className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Weekend Batches</h4>
                      <p className="text-sm text-gray-600">Special weekend programs for working professionals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Study Resources</CardTitle>
                  <CardDescription className="text-sm">Comprehensive study materials for thorough preparation</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Study Materials</h4>
                      <p className="text-sm text-gray-600">Well-structured notes and practice questions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Discussion Forums</h4>
                      <p className="text-sm text-gray-600">Interactive platform for doubt clearing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Start Your UPSC Journey Today</CardTitle>
              <CardDescription className="text-sm">Join Administrative World and take the first step towards your dream career</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="w-full sm:w-auto">Enroll Now</Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Learn More</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdditionalDetails;