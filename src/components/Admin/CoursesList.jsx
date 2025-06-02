import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { SquarePlus, LifeBuoy, BookCheck, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminCourseCardData } from "../../configs/Site"

function CoursesList() {
  const navigate = useNavigate();


  // const adminCourseCardData = [
  //   {
  //     title: "Create New",
  //     description: "Start creating new courses with interactive content, assessments, and multimedia resources.",
  //     icon: <SquarePlus className="h-6 w-6" />,
  //     path: "/admin/course/create",
  //     features: [
  //       "Course Structure & Modules",
  //       "Interactive Content Creation",
  //       "Assessment & Quiz Builder"
  //     ],
  //     buttonText: "Create New Course",
  //     variant: "primary",
  //     bgColor: "from-primary/5 to-transparent",
  //     iconBg: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  //     badgeColor: "bg-green-500"
  //   },
  //   {
  //     title: "Draft Courses",
  //     description: "Continue working on your draft courses. Edit, review, and prepare them for publication.",
  //     icon: <LifeBuoy className="h-6 w-6" />,
  //     path: "/admin/course/draft",
  //     features: [
  //       "Work in Progress Courses",
  //       "Auto-save & Version Control",
  //       "Preview & Testing Tools"
  //     ],
  //     buttonText: "View Drafts",
  //     variant: "secondary",
  //     bgColor: "from-orange/10 to-transparent",
  //     iconBg: "bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white",
  //     badgeColor: "bg-orange-500"
  //   },
  //   {
  //     title: "Published Courses",
  //     description: "Manage your live courses, track performance, and analyze student engagement and progress.",
  //     icon: <BookCheck className="h-6 w-6" />,
  //     path: "/admin/course/published",
  //     features: [
  //       "Live Course Management",
  //       "Analytics & Performance",
  //       "Student Progress Tracking"
  //     ],
  //     buttonText: "View Published",
  //     variant: "outline",
  //     bgColor: "from-secondary/10 to-transparent",
  //     iconBg: "bg-secondary/20 text-secondary-foreground group-hover:bg-secondary group-hover:text-secondary-foreground",
  //     badgeColor: "bg-blue-500"
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Course Management</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, manage, and publish your educational courses. Track progress from draft to publication.
          </p>
          <Badge variant="secondary" className="text-sm">
            <FileText className="h-4 w-4 mr-1" />
            Admin Dashboard
          </Badge>
        </div>

        {/* Course Management Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 max-w-7xl mx-auto">
          {adminCourseCardData.map((card, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer relative overflow-hidden h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${card.iconBg} transition-colors duration-300`}>
                    {card.icon}
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {card.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-4 flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {card.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${card.badgeColor}`} />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate(card.path)}
                  variant={card.variant === 'primary' ? 'default' : card.variant}
                  className="w-full mt-auto group-hover:translate-y-0 transition-all duration-300"
                  size="lg"
                >
                  {card.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats Section */}
        {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="text-center border-0 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <p className="text-sm text-muted-foreground">Unlimited Courses</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">Auto</div>
              <p className="text-sm text-muted-foreground">Save & Backup</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">Real-time</div>
              <p className="text-sm text-muted-foreground">Analytics</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Call to Action */}
        {/* <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Ready to create your next course?
          </p>
          <Button
            onClick={() => navigate("/admin/course/create")}
            size="lg"
            className="px-8"
          >
            <SquarePlus className="mr-2 h-5 w-5" />
            Start Creating Now
          </Button>
        </div> */}
      </div>
    </div>
  );
}

export default CoursesList;