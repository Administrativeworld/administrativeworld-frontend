import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Go back to previous page, or home if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          {/* Company Logo */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center">
              <img 
                src="https://res.cloudinary.com/dqvkbnrlu/image/upload/v1749396329/apple-touch-icon_tgjqag.png" 
                alt="Company Logo" 
                className="w-12 h-12 rounded-full"
              />
            </div>
          </div>

          {/* 404 Message */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Go Back Button */}
          <Button 
            onClick={handleGoBack}
            className="w-full"
            size="lg"
          >
            Go Back
          </Button>

          {/* Alternative Navigation */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/home')}
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;