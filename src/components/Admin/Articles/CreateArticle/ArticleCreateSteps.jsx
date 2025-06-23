import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import {
  setStep,
  resetForm,
  selectCurrentStep,
  selectFormData,
  selectIsLoading
} from '@/redux/api/createArticleSlice';
import ArticleForm from './ArticleForm';
import ArticleEditor from './ArticleEditor';
import toast from 'react-hot-toast';
import axios from 'axios';

const STEPS = [
  { id: 0, title: 'Article Details', description: 'Basic information and SEO settings' },
  { id: 1, title: 'Content Editor', description: 'Write your article content' }
];

const ArticleCreateSteps = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const formData = useSelector(selectFormData);
  const isLoading = useSelector(selectIsLoading);

  const handleNext = useCallback(() => {
    dispatch(setStep(currentStep + 1));
  }, [dispatch, currentStep]);

  const handlePrevious = useCallback(() => {
    dispatch(setStep(currentStep - 1));
  }, [dispatch, currentStep]);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      dispatch(resetForm());
    }
  }, [dispatch]);

  const handleSave = async () => {
    try {
      if (!formData.title ||
        !formData.slug ||
        !formData.content ||
        !formData.category ||
        !formData.tags ||
        !formData.metaTitle ||
        !formData.metaDescription) {
        toast.error("Fill required fields")
      }
      const createArticleResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/article/createArticle`, { formData },
        {
          withCredentials: true
        }
      );
      if (createArticleResponse.status === 201) {
        toast.success(createArticleResponse.data.message || 'Article created successfully!');
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    // Post-save actions like API submission or navigation
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <ArticleForm onNext={handleNext} />;
      case 1:
        return <ArticleEditor onPrevious={handlePrevious} onSave={handleSave} />;
      default:
        return <ArticleForm onNext={handleNext} />;
    }
  };

  const progressValue = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Article</h1>
          <p className="text-muted-foreground">Follow the steps below to create and publish your article</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl">{STEPS[currentStep]?.title}</CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="outline">Step {currentStep + 1} of {STEPS.length}</Badge>
                <Button variant="ghost" size="sm" onClick={handleReset} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{STEPS[currentStep]?.description}</p>

            <Progress value={progressValue} />
            <div className="flex justify-between mt-2">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${index < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : index === currentStep
                          ? 'border-2 border-primary text-primary'
                          : 'bg-muted text-muted-foreground'}
                    `}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm hidden sm:inline">{step.title}</span>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {getStepComponent()}
          </CardContent>
        </Card>

        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Form Data (Debug)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-40">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArticleCreateSteps;
