import {
  Mail,
  MapPin,
  Phone,
  Book,
  GraduationCap,
  HelpCircle,
  Users,
  Info,
  PlayCircle,
  Library,
  BookOpen,
  Bookmark,
  HeartHandshake,
  Building2,
  ShieldCheck,
  BadgeHelp,
  GanttChartSquare,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      {/* Top Section with Slight Darker Background */}
      <div className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* BookStore Info */}
            <Card className="bg-background/50 backdrop-blur-sm border-none" onClick={() => navigate("/home/store")}>
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Book className="h-5 w-5 text-primary" />
                  Book Store
                  <Badge className="ml-2">Est. 2018</Badge>
                </CardTitle>
                <CardDescription className="text-secondary-foreground/75">Your Gateway to Knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-secondary-foreground/75">
                  Explore a wide range of books and resources dedicated to Public Administration. Whether you're a student, aspirant, or professional, our curated collection is designed to deepen your understanding of how public institutions work and evolve..
                </p>
              </CardContent>
            </Card>

            {/* Company Links */}
            <Card className="bg-background/50 backdrop-blur-sm border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Company
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <nav className="space-y-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80" onClick={() => navigate("/home/about")}>
                          <Info className="h-4 w-4" /> About Us
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Learn about our story</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80" onClick={() => navigate("/home/contact")}>
                          <GanttChartSquare className="h-4 w-4" /> How to Contact?
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Our process explained</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80" onClick={() => navigate("/home/explore")}>
                          <Library className="h-4 w-4" /> Popular Course
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Top-rated courses</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80" onClick={() => navigate("/home/explore")}>
                          <HeartHandshake className="h-4 w-4" /> Service
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>What we offer</TooltipContent>
                    </Tooltip>
                  </nav>
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* Courses */}
            <Card className="bg-background/50 backdrop-blur-sm border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Courses
                  <Badge variant="outline" className="ml-2">New</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80" onClick={() => navigate("/home/explore")}>
                    <BookOpen className="h-4 w-4" /> Courses
                  </Button>
                  {/*<Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80">
                    <Users className="h-4 w-4" /> Offline Course
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80">
                    <PlayCircle className="h-4 w-4" /> Video Course
                  </Button>*/}
                </nav>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-background/50 backdrop-blur-sm border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80" onClick={() => navigate("/home/contact")}>
                    <BadgeHelp className="h-4 w-4" /> Contact Us
                  </Button>
                  {/*<Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80">
                    <HelpCircle className="h-4 w-4" /> Help Center
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80">
                    <Bookmark className="h-4 w-4" /> Career
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-8 hover:bg-background/80">
                    <Lock className="h-4 w-4" /> Privacy
                  </Button>*/}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info - Full Width Section */}
          <div className="mt-8">
            <Card className="bg-background/50 backdrop-blur-sm border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact Info
                  <Badge variant="secondary">24/7 Support</Badge>
                </CardTitle>
                <CardDescription className="text-secondary-foreground/75">Get in touch with us</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant="secondary" className="justify-start gap-2">
                    <Phone className="h-4 w-4" />
                    +91 98968-59767
                  </Button>
                  <Button variant="secondary" className="justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    contactadworld@gmail.com
                  </Button>
                  <Button variant="secondary" className="justify-start gap-2">
                    <MapPin className="h-4 w-4" />
                    Hisar (Haryana)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Bottom with Darker Background */}
      <div className="border-t border-border/50 bg-secondary/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/75">
              Administrative World All Rights Reserved, 2018
            </p>
            <div className="flex gap-3">
              <Badge variant="outline" className="bg-background/50">
                <Book className="h-4 w-4 mr-1" /> 5+ Books
              </Badge>
              <Badge variant="outline" className="bg-background/50">
                <Users className="h-4 w-4 mr-1" /> 70K+ Users
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;