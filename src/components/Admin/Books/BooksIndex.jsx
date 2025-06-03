import React from 'react';
import { PlusCircle, BookOpen, FileText, Eye, ArrowRight, Sparkles } from 'lucide-react';

// Import shadcn/ui components from their default install location
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

function BooksIndex() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Content Hub</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, manage, and publish your educational content with ease.
            From notes to test series, everything you need in one place.
          </p>
          <Badge variant="secondary" className="text-sm">
            <FileText className="h-4 w-4 mr-1" />
            Educational Content Platform
          </Badge>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Content Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Create Content</CardTitle>
              </div>
              <CardDescription className="text-base">
                Start creating new educational content including notes, test series, materials, and books.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Notes & Study Materials
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Test Series & Assessments
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Books & Reference Materials
                </div>
              </div>
              <Button
                onClick={() => navigate('/admin/books/create')}
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                size="lg"
              >
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </CardContent>
          </Card>

          {/* See Published Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary/20 text-secondary-foreground group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors duration-300">
                  <Eye className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">See Published</CardTitle>
              </div>
              <CardDescription className="text-base">
                View, manage, and analyze your published content. Track performance and make updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-orange-500" />
                  Content Library & Analytics
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 text-teal-500" />
                  Performance Tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PlusCircle className="h-4 w-4 text-indigo-500" />
                  Content Management
                </div>
              </div>
              <Button
                onClick={() => navigate('/admin/books/published')}
                variant="secondary"
                className="w-full group-hover:bg-secondary/80 transition-colors duration-300"
                size="lg"

              >
                View Published Content
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Section */}
        {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="text-center border-0 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <p className="text-sm text-muted-foreground">Content Templates</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">Easy</div>
              <p className="text-sm text-muted-foreground">Publishing Process</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Access & Support</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Call to Action */}
        {/* <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Ready to get started with your educational content?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleCreateContent} size="lg" className="px-8">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Content
            </Button>
            <Button onClick={handleSeePublished} variant="outline" size="lg" className="px-8">
              <Eye className="mr-2 h-5 w-5" />
              Browse Published Content
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default BooksIndex;