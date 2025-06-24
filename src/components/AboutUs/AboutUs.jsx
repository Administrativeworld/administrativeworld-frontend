import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Rocket,
  Book,
  LightbulbIcon,
  Target,
  Star,
  TrendingUp,
  Laptop,
  MessageCircle,
  CheckCircle2,
  Users,
  GraduationCap
} from 'lucide-react';
import Team from './team';
import { Helmet } from 'react-helmet';
import dynamicMetaDataSeo from '@/configs/dynamicMetaDataSeo';
import { useLocation } from 'react-router-dom';

const AboutUs = () => {
  const location = useLocation();
  const currentUrl = `${import.meta.env.VITE_DOMAIN}${location.pathname}`;

  const services = [
    {
      title: "Comprehensive UPSC Study Materials",
      description: "Well-researched notes, current affairs, previous year papers, and comprehensive PDFs covering the entire UPSC syllabus with regular updates.",
      icon: <Book className="w-6 h-6" />,
      keywords: ["UPSC study materials", "comprehensive notes", "current affairs"]
    },
    {
      title: "Expert-Led UPSC Classes",
      description: "Live interactive sessions and recorded classes by experienced civil servants and subject matter experts with proven track records.",
      icon: <GraduationCap className="w-6 h-6" />,
      keywords: ["UPSC coaching", "expert classes", "civil servants"]
    },
    {
      title: "Personalized UPSC Mentorship",
      description: "One-on-one guidance from successful candidates for strategy planning, doubt resolution, and continuous motivation throughout your preparation.",
      icon: <Users className="w-6 h-6" />,
      keywords: ["UPSC mentorship", "personal guidance", "strategy planning"]
    },
    {
      title: "UPSC Test Series & Mock Exams",
      description: "Comprehensive test series with detailed analysis, all-India rankings, and exam-like practice to improve accuracy and time management skills.",
      icon: <CheckCircle2 className="w-6 h-6" />,
      keywords: ["UPSC test series", "mock exams", "prelims practice"]
    }
  ];

  const features = [
    {
      title: "Trusted UPSC Coaching Institute",
      description: "Proven track record with structured study plans, expert guidance, and consistent results in UPSC civil services examination.",
      icon: <Star className="w-6 h-6" />,
      keywords: ["trusted UPSC coaching", "proven results"]
    },
    {
      title: "Results-Oriented UPSC Strategy",
      description: "Data-driven approach helping thousands of aspirants achieve top ranks in UPSC prelims, mains, and interview stages.",
      icon: <TrendingUp className="w-6 h-6" />,
      keywords: ["UPSC strategy", "top ranks", "success rate"]
    },
    {
      title: "Technology-Enabled UPSC Learning",
      description: "Advanced online platform with mobile apps, interactive content, AI-powered analytics, and modern study tools for effective preparation.",
      icon: <Laptop className="w-6 h-6" />,
      keywords: ["online UPSC coaching", "mobile learning", "digital platform"]
    },
    {
      title: "UPSC Community Support",
      description: "Active discussion forums, study groups, peer-to-peer learning, and 24/7 doubt resolution through dedicated community channels.",
      icon: <MessageCircle className="w-6 h-6" />,
      keywords: ["UPSC community", "peer learning", "doubt resolution"]
    }
  ];

  // Structured data for About Us page
  const aboutPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Administrative World - Premier UPSC Coaching Institute",
    "description": "Learn about Administrative World's mission to provide quality UPSC coaching, expert mentorship, and comprehensive study materials for civil services aspirants across India.",
    "url": currentUrl,
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "Administrative World",
      "url": import.meta.env.VITE_DOMAIN,
      "logo": `${import.meta.env.VITE_DOMAIN}/logo.png`,
      "description": "Premier UPSC coaching institute providing comprehensive civil services preparation with expert guidance, study materials, and mentorship programs.",
      "foundingDate": "2020",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hisar",
        "addressRegion": "Haryana",
        "postalCode": "125001",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-98968-59767",
        "contactType": "customer service",
        "email": "info@administrativeworld.com"
      },
      "offers": [
        {
          "@type": "Course",
          "name": "UPSC Civil Services Comprehensive Course",
          "provider": "Administrative World",
          "courseMode": "blended"
        },
        {
          "@type": "Course",
          "name": "UPSC Mentorship Program",
          "provider": "Administrative World",
          "courseMode": "online"
        }
      ],
      "sameAs": [
        "https://www.youtube.com/@Admn_World",
        "https://facebook.com/yourpage"
      ]
    }
  };

  // FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes Administrative World different from other UPSC coaching institutes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Administrative World offers personalized mentorship, comprehensive study materials, expert-led classes by civil servants, and technology-enabled learning with proven results in UPSC civil services examination."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide both online and offline UPSC coaching?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide both online and offline UPSC coaching with live classes, recorded sessions, and comprehensive study materials accessible through our digital platform."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{dynamicMetaDataSeo.about.title}</title>
        <meta name="description" content={dynamicMetaDataSeo.about.description} />
        <meta name="keywords" content={dynamicMetaDataSeo.about.keywords} />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={dynamicMetaDataSeo.about.title} />
        <meta property="og:description" content={dynamicMetaDataSeo.about.description} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Administrative World" />
        <meta property="og:image" content={`${import.meta.env.VITE_DOMAIN}/about-og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Administrative World - Premier UPSC Coaching Institute" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section with enhanced SEO content */}
        <section className="py-20 px-4" role="banner">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              India's Premier UPSC Coaching Institute
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Administrative World - Empowering UPSC Civil Services Dreams
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Discover how Administrative World has become India's trusted UPSC coaching institute, providing comprehensive civil services preparation,
              expert mentorship, and proven strategies to help thousands of aspirants achieve their IAS, IPS, and IFS dreams since our establishment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8" aria-label="Start your UPSC preparation journey">
                Begin UPSC Journey
              </Button>
              <Button variant="outline" size="lg" className="px-8" aria-label="Learn more about our courses">
                Explore Our Courses
              </Button>
            </div>
          </div>
        </section>

        <Team />

        {/* Mission Section with structured content */}
        <section className="py-16 px-4" role="main" aria-labelledby="mission-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="mission-heading" className="text-3xl font-bold mb-4">
                Our Mission - Transforming UPSC Preparation in India
              </h2>
              <p className="text-lg max-w-3xl mx-auto">
                Administrative World is committed to democratizing quality UPSC education, making comprehensive civil services preparation
                accessible to aspirants from all backgrounds across India through innovative teaching methods and technology-driven solutions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow" itemScope itemType="https://schema.org/Service">
                <CardContent className="pt-6">
                  <Rocket className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2" itemProp="name">Simplify UPSC Learning</h3>
                  <p className="text-muted-foreground" itemProp="description">
                    We break down complex UPSC syllabus into digestible modules, making civil services preparation
                    easier and more effective for aspirants at every level.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow" itemScope itemType="https://schema.org/Service">
                <CardContent className="pt-6">
                  <Book className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2" itemProp="name">Premium UPSC Resources</h3>
                  <p className="text-muted-foreground" itemProp="description">
                    Comprehensive study materials, current affairs updates, previous year papers, and exclusive content
                    designed specifically for UPSC civil services examination success.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow" itemScope itemType="https://schema.org/Service">
                <CardContent className="pt-6">
                  <LightbulbIcon className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2" itemProp="name">Conceptual Clarity in UPSC</h3>
                  <p className="text-muted-foreground" itemProp="description">
                    Focus on building strong foundations with conceptual understanding, strategic preparation techniques,
                    and advanced answer writing skills for UPSC mains examination.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow" itemScope itemType="https://schema.org/Service">
                <CardContent className="pt-6">
                  <Target className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
                  <h3 className="font-semibold mb-2" itemProp="name">Bridge Success Gap</h3>
                  <p className="text-muted-foreground" itemProp="description">
                    Connecting aspirants with their UPSC success through personalized guidance, proven methodologies,
                    and continuous support throughout the preparation journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section with enhanced SEO */}
        <section className="bg-muted/50 py-16 px-4" aria-labelledby="services-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="services-heading" className="text-3xl font-bold mb-4">
                Comprehensive UPSC Preparation Services
              </h2>
              <p className="text-lg max-w-3xl mx-auto">
                End-to-end solutions designed to cover every aspect of UPSC civil services preparation,
                from foundational learning to advanced strategy development and exam-day readiness.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow" itemScope itemType="https://schema.org/Service">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="text-primary" aria-hidden="true">{service.icon}</div>
                      <CardTitle itemProp="name">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" itemProp="description">{service.description}</p>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">
                        <strong>Key focus:</strong> {service.keywords.join(', ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with competitive advantages */}
        <section className="py-16 px-4" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="features-heading" className="text-3xl font-bold mb-4">
                Why Administrative World Leads UPSC Coaching in India
              </h2>
              <p className="text-lg max-w-3xl mx-auto">
                Discover the unique advantages that make Administrative World the preferred choice for serious UPSC aspirants
                seeking comprehensive preparation and guaranteed results in civil services examination.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow" itemScope itemType="https://schema.org/Service">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="text-primary" aria-hidden="true">{feature.icon}</div>
                      <CardTitle itemProp="name">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" itemProp="description">{feature.description}</p>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">
                        <strong>Specialization:</strong> {feature.keywords.join(', ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section for credibility */}
        <section className="bg-muted/50 py-16 px-4" aria-labelledby="stats-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="stats-heading" className="text-3xl font-bold mb-4">
                Administrative World's UPSC Success Story in Numbers
              </h2>
              <p className="text-lg">
                Our track record speaks volumes about our commitment to UPSC excellence
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                  <h3 className="font-semibold">UPSC Aspirants Trained</h3>
                  <p className="text-sm text-muted-foreground">Since inception</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <h3 className="font-semibold">Successful Selections</h3>
                  <p className="text-sm text-muted-foreground">In various civil services</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <h3 className="font-semibold">Top 100 Ranks</h3>
                  <p className="text-sm text-muted-foreground">In UPSC CSE</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <h3 className="font-semibold">Student Support</h3>
                  <p className="text-sm text-muted-foreground">Round-the-clock assistance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section with enhanced conversion focus */}
        <section className="bg-primary text-primary-foreground py-20 px-4" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold mb-6">
              Ready to Begin Your UPSC Success Journey with Administrative World?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of successful civil servants who trusted Administrative World for their UPSC preparation.
              Start your transformation today with India's most comprehensive UPSC coaching program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="px-8"
                aria-label="Enroll in UPSC courses now"
              >
                Start UPSC Preparation Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary px-8"
                aria-label="Contact our UPSC experts"
              >
                Speak with UPSC Experts
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              Free consultation available • No hidden charges • 100% transparent process
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;