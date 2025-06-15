import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Star, Users } from 'lucide-react';

function CourseHeader({ courseDetails }) {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-primary">
              {courseDetails.courseName}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              {courseDetails.courseDescription}
            </CardDescription>
          </div>
          <img
            src={courseDetails.thumbnail}
            alt="Course thumbnail"
            className="w-24 h-24 rounded-lg object-cover border-2 border-border"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-5 w-5" />
            <span>{courseDetails.instructor.firstName} {courseDetails.instructor.lastName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="h-5 w-5" />
            <span>{courseDetails.avgRating || 0} Rating</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>{courseDetails.purchases} Students</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">₹{courseDetails.price}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {courseDetails.tag.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
}

export default CourseHeader;