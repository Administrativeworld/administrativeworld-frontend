import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Book,
  Users,
  Target,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

const AdditionalDetails = ({ metaData }) => {
  return (
    <section className="min-h-screen bg-background" aria-labelledby="course-details-heading">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header Section */}
        <header className="mb-4 sm:mb-8">
          <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="space-y-1">
              <h1 id="course-details-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
                <span className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </span>
                <span className="leading-tight">Course Details</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Comprehensive preparation for UPSC and other competitive exams.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6" aria-label="Course Statistics">
            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Book className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Courses</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {metaData ? metaData.totalCourses : 'N/A'}+
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Resources</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {metaData ? metaData.totalStudyMaterial : 'N/A'}+
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </header>

        {/* Features Tabs Section */}
        <section aria-label="Detailed Features">
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-3 sm:p-6">
              <div className="max-w-6xl mx-auto">
                <Tabs defaultValue="courses" className="w-full">
                  <div className="overflow-hidden mb-4 sm:mb-6">
                    <TabsList className="w-full flex grid-cols-4 h-auto p-1">
                      <TabsTrigger
                        value="courses"
                        className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                          <Book className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">Courses</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="resources"
                        className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">Resources</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Courses Tab */}
                  <TabsContent value="courses" className="mt-0">
                    <article aria-labelledby="courses-tab-heading">
                      <Card className="border-2 border-border">
                        <CardHeader className="pb-3 sm:pb-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                              <Book className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle id="courses-tab-heading" className="text-lg sm:text-xl">Our Courses</CardTitle>
                              <CardDescription className="text-xs sm:text-sm">
                                Comprehensive preparation for UPSC and other competitive exams.
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <Card className="p-3 sm:p-4 bg-muted/50">
                              <div className="flex items-start space-x-3">
                                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                  <Book className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <h2 className="text-sm sm:text-base font-semibold mb-1">Foundation Course</h2>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    Complete syllabus coverage with basic to advanced concepts.
                                  </p>
                                </div>
                              </div>
                            </Card>

                            <Card className="p-3 sm:p-4 bg-muted/50">
                              <div className="flex items-start space-x-3">
                                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <h2 className="text-sm sm:text-base font-semibold mb-1">Test Series</h2>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    Regular mock tests with detailed analysis.
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    </article>
                  </TabsContent>

                  {/* Resources Tab */}
                  <TabsContent value="resources" className="mt-0">
                    <article aria-labelledby="resources-tab-heading">
                      <Card className="border-2 border-border">
                        <CardHeader className="pb-3 sm:pb-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                            </div>
                            <div>
                              <CardTitle id="resources-tab-heading" className="text-lg sm:text-xl">Study Resources</CardTitle>
                              <CardDescription className="text-xs sm:text-sm">
                                Comprehensive study materials for thorough preparation.
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <Card className="p-3 sm:p-4 bg-muted/50">
                              <div className="flex items-start space-x-3">
                                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <h2 className="text-sm sm:text-base font-semibold mb-1">Study Materials</h2>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    Well-structured notes and practice questions.
                                  </p>
                                </div>
                              </div>
                            </Card>

                            <Card className="p-3 sm:p-4 bg-muted/50">
                              <div className="flex items-start space-x-3">
                                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <h2 className="text-sm sm:text-base font-semibold mb-1">Discussion Forums</h2>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    Interactive platform for doubt clearing.
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    </article>
                  </TabsContent>

                </Tabs>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </section>
  );
};

AdditionalDetails.propTypes = {
  metaData: PropTypes.shape({
    totalRegisteredStudent: PropTypes.number,
    totalCourses: PropTypes.number,
    totalStudyMaterial: PropTypes.number,
    totalEnrolledMaterials: PropTypes.number,
    totalStoreItems: PropTypes.number,
    breakdown: PropTypes.shape({
      coursePurchases: PropTypes.number,
      storePurchases: PropTypes.number,
    }),
  }).isRequired,
};

export default AdditionalDetails;
