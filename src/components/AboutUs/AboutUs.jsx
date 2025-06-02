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

const AboutUs = () => {
  const services = [
    {
      title: "Comprehensive Study Materials",
      description: "Well-structured notes, books, and PDFs to cover the entire syllabus.",
      icon: <Book className="w-6 h-6" />
    },
    {
      title: "Expert-Led Classes",
      description: "Live & recorded sessions by subject matter experts.",
      icon: <GraduationCap className="w-6 h-6" />
    },
    {
      title: "Personalized Mentorship",
      description: "One-on-one guidance for doubts, strategy, and motivation.",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Test Series & Mock Exams",
      description: "Real exam-like practice to improve accuracy & time management.",
      icon: <CheckCircle2 className="w-6 h-6" />
    }
  ];

  const features = [
    {
      title: "Trusted & Proven Approach",
      description: "Structured study plans and expert guidance.",
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Results-Oriented Strategy",
      description: "Helping aspirants achieve their dream ranks.",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: "Tech-Enabled Learning",
      description: "Online classes, mobile-friendly content & study tools.",
      icon: <Laptop className="w-6 h-6" />
    },
    {
      title: "Community Support",
      description: "Discussion forums, Telegram & WhatsApp groups for peer learning.",
      icon: <MessageCircle className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className=" py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">Welcome to Administrative World</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Your UPSC Journey</h1>
          <p className=" text-lg md:text-xl max-w-3xl mx-auto mb-8">
            We are dedicated to providing high-quality resources, courses, and guidance for UPSC and other competitive exams. Our team is committed to empowering aspirants with the right knowledge and strategies to achieve their goals.
          </p>
          <Button size="lg" className="mr-4">Get Started</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </section>

      <Team/>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Do</h2>
            <p className="">Our mission is to make quality education accessible to all aspirants</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Rocket className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Simplify Learning</h3>
                <p className="">We simplify complex subjects and make learning easier for aspirants.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Book className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Premium Resources</h3>
                <p className="">We provide free and premium resources to help students excel in UPSC & state exams.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <LightbulbIcon className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Conceptual Clarity</h3>
                <p className="">We focus on conceptual clarity, strategic preparation, and answer writing skills.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Bridge the Gap</h3>
                <p className="">We aim to bridge the gap between aspirants and success with quality education.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className=" py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="">Comprehensive solutions for your UPSC preparation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {service.icon}
                    <CardTitle>{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="">What makes Administrative World different</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="  py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8">Join thousands of successful aspirants who have achieved their dreams with Administrative World</p>
          <Button size="lg" variant="secondary" className="mr-4">Join Now</Button>
          <Button size="lg" variant="outline" className=" border-white hover:text-primary">
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;