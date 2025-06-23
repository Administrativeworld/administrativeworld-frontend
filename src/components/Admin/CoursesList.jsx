import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminCourseManagement } from "../../configs/Site"

function CoursesList() {
  const navigate = useNavigate();



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
          {adminCourseManagement.map((card, index) => (
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
      </div>
    </div>
  );
}

export default CoursesList;