import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Star,
  Clock,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Zap,
  Target,
  CheckCircle,
  Pause
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";

const slideImages = [
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763681/5_xe6qcy.jpg",
    alt: "Expert Faculty"
  },
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763681/4_o8mbrz.jpg",
    alt: "Modern Facilities"
  },
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763680/3_djtgen.jpg",
    alt: "Success Stories"
  },
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763680/2_tx9ybt.jpg",
    alt: "Achievement Gallery"
  },
  {
    url: "https://res.cloudinary.com/dqvkbnrlu/image/upload/v1748763680/1_kqw6kr.jpg",
    alt: "Learning Environment"
  }
];



const features = [
  {
    icon: Zap,
    title: "Interactive Learning",
    description: "Engage with dynamic content and real-time feedback",
    color: "blue"
  },
  {
    icon: Target,
    title: "Personalized Path",
    description: "Customized learning journey based on your goals",
    color: "green"
  },
  {
    icon: Clock,
    title: "24/7 Access",
    description: "Study anytime, anywhere with our flexible platform",
    color: "purple"
  },
  {
    icon: CheckCircle,
    title: "Proven Results",
    description: "Join thousands of successful students worldwide",
    color: "orange"
  }
];

export default function HeroSection({ metaData }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const achievements = [
    { icon: Users, label: "Registered Students", value: `${metaData ? metaData.totalRegisteredStudent : 'N/A'}+`, color: "blue" },
    { icon: BookOpen, label: "Study Materials", value: `${metaData ? metaData.totalStudyMaterial : 'N/A'}+`, color: "green" },
    // { icon: Trophy, label: "Success Rate", value: "95%", color: "purple" },
    // { icon: Award, label: "Expert Faculty", value: "50+", color: "orange" }
  ];
  console.log('HeroSEction', metaData)
  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-8 sm:space-y-12 lg:space-y-16">



        {/* Main Content Section */}
        <section className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-xl">
                <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                Premium Education Platform
              </Badge>
            </div>

            <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                Your Pathway
                <span className="block text-primary mt-2">To Serving The Nation</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Administration world  is a training coching provider based across the india that specialises in accredited and bespoke training courses.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 h-auto" onClick={() => navigate('/home/explore')}>
                <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Start Learning Now
              </Button>
              <Button variant="outline" size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 h-auto"
                onClick={() => navigate('/home/store')}
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Download Brochure
              </Button>
            </div>
          </div>
        </section>
        {/* Image Slider Section */}
        <section className="w-full">
          <Card className="overflow-hidden border-2 shadow-lg">
            <div className="relative">
              {/* Main Image Container - 16:9 aspect ratio for universal compatibility */}
              <div className="relative w-full aspect-video overflow-hidden bg-muted">
                {slideImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                      }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjE4MCIgcj0iNDAiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTMyMCAyNDBIMzYwTDM4MCAyNzBINDIwTDQ0MCAyNDBINDgwVjMwMEgzMjBWMjQwWiIgZmlsbD0iI0QxRDVEQiIvPgo8dGV4dCB4PSI0MDAiIHk9IjM0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FZHVjYXRpb25hbCBJbWFnZTwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                  </div>
                ))}

                {/* Navigation Controls */}
                <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4">
                  <button
                    onClick={prevSlide}
                    className="p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200 backdrop-blur-sm hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200 backdrop-blur-sm hover:scale-110"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>
                </div>

                {/* Slide Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">
                        {slideImages[currentSlide].alt}
                      </h3>
                      <p className="text-white/90 text-sm sm:text-base lg:text-lg">
                        Experience excellence in modern education
                      </p>
                    </div>

                    {/* Auto-play control */}
                    <button
                      onClick={toggleAutoPlay}
                      className="self-start sm:self-auto p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
                      aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                    >
                      {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
                  {slideImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-full ${index === currentSlide
                        ? 'w-8 sm:w-10 h-2 sm:h-3 bg-white'
                        : 'w-2 sm:w-3 h-2 sm:h-3 bg-white/50 hover:bg-white/75'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Slide Counter */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                  {currentSlide + 1} / {slideImages.length}
                </div>
              </div>
            </div>
          </Card>
        </section>
        {/* Achievement Stats Section */}
        <section>
          <div className="flex  grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {achievements.map((stat, index) => (
              <Card key={index} className=" w-1/2 p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 hover:scale-105">
                <CardContent className="p-0 space-y-3 sm:space-y-4">
                  <div className={`inline-flex p-3 sm:p-4 rounded-xl ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    stat.color === 'green' ? 'bg-green-100 text-green-600' :
                      stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                    }`}>
                    <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{stat.value}</p>
                    <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Why Choose Our Platform?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover what makes our educational platform the preferred choice for ambitious learners worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:scale-105 group">
                <CardContent className="p-0 space-y-4 sm:space-y-6">
                  <div className={`inline-flex p-4 sm:p-5 rounded-xl transition-transform group-hover:scale-110 ${feature.color === 'blue' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200' :
                    feature.color === 'green' ? 'bg-green-100 text-green-600 group-hover:bg-green-200' :
                      feature.color === 'purple' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' :
                        'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                    }`}>
                    <feature.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-2 border-primary/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardContent className="relative p-6 sm:p-8 lg:p-12 text-center">
              <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                <div className="inline-flex p-4 sm:p-5 bg-primary/10 rounded-full mb-4 sm:mb-6">
                  <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                    Ready to Start Your Success Story?
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    Join our community of learners and unlock your potential with our comprehensive study materials, expert guidance, and proven success methodologies.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 sm:pt-6 max-w-md sm:max-w-none mx-auto">
                  <Button size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-5 h-auto shadow-lg hover:shadow-xl" onClick={() => navigate('/home/store')}>
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Browse Study Materials
                  </Button>
                  <Button variant="outline" size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-5 h-auto shadow-lg hover:shadow-xl border-2" disabled>
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Join Free Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );

}
HeroSection.propTypes = {
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
