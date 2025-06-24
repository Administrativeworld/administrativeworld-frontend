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
import { data, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Footer = () => {
  const navigate = useNavigate();
  const [metaData, setMetaData] = useState();

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const dataResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/metadata/getBasicMetaDataOptimized`);
        setMetaData(dataResponse.data.data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetaData();
  }, []);

  return (
    <footer className="min-h-screen bg-background border-t" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
                <div
                  className="p-1.5 sm:p-2 bg-primary/10 rounded-lg"
                  aria-hidden="true"
                >
                  <Book className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span className="leading-tight">Administrative World</span>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Your Gateway to Knowledge and Excellence
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Badge className="gap-1 sm:gap-2 text-xs sm:text-sm" aria-label="Established in 2018">
                <Book className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                <span>Est. 2018</span>
              </Badge>
              <Badge
                variant="outline"
                className="gap-1 sm:gap-2 text-xs sm:text-sm"
                aria-label={`${metaData ? metaData.totalRegisteredStudent : 'N/A'} registered users`}
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                <span>{metaData ? metaData.totalRegisteredStudent : 'N/A'}+ Users</span>
              </Badge>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6" role="region" aria-label="Company statistics">
            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0" aria-hidden="true">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Books Available</p>
                  <p className="text-lg sm:text-xl font-bold" aria-label={`${metaData ? metaData.totalStoreItems : 'N/A'} books available`}>
                    {metaData ? metaData.totalStoreItems : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0" aria-hidden="true">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Paid Users</p>
                  <p className="text-lg sm:text-xl font-bold" aria-label={`${metaData ? metaData.totalRegisteredStudent : 'N/A'} paid users`}>
                    {metaData ? metaData.totalRegisteredStudent : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0" aria-hidden="true">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Years Experience</p>
                  <p className="text-lg sm:text-xl font-bold" aria-label="7 plus years of experience">7+</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0" aria-hidden="true">
                  <HeartHandshake className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Support</p>
                  <p className="text-lg sm:text-xl font-bold" aria-label="24/7 customer support">24/7</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {/* BookStore Info Card */}
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg" aria-hidden="true">
                      <Book className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Book Store</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Your Gateway to Knowledge</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Explore a wide range of books and resources dedicated to Public Administration. Whether you're a student, aspirant, or professional, our curated collection is designed to deepen your understanding of how public institutions work and evolve.
                  </p>
                </div>
                <Link
                  to="/home/store"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 w-full sm:w-auto"
                  aria-label="Visit our book store"
                >
                  <Book className="h-4 w-4" aria-hidden="true" />
                  Visit Store
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {/* Company Links */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg" aria-hidden="true">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  Company
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav aria-label="Company navigation">
                  <ul className="space-y-1 sm:space-y-2 list-none">
                    <li>
                      <Link
                        to="/home/about"
                        className="inline-flex items-center justify-start w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <Info className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/home/contact"
                        className="inline-flex items-center justify-start w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <GanttChartSquare className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                        How to Contact?
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/home/explore"
                        className="inline-flex items-center justify-start w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <Library className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                        Popular Course
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/home/explore"
                        className="inline-flex items-center justify-start w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <HeartHandshake className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                        Service
                      </Link>
                    </li>
                  </ul>
                </nav>
              </CardContent>
            </Card>

            {/* Courses */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg" aria-hidden="true">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  Courses
                  <Badge variant="outline" className="ml-2 text-xs">New</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav aria-label="Courses navigation">
                  <ul className="space-y-1 sm:space-y-2 list-none">
                    <li>
                      <Link
                        to="/home/explore"
                        className="inline-flex items-center justify-start w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                        Courses
                      </Link>
                    </li>
                  </ul>
                </nav>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg" aria-hidden="true">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav aria-label="Support navigation">
                  <ul className="space-y-1 sm:space-y-2 list-none">
                    <li>
                      <Link
                        to="/home/contact"
                        className="inline-flex items-center justify-start w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <BadgeHelp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info - Full Width Section */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg" aria-hidden="true">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Contact Info</CardTitle>
                  <Badge variant="secondary" className="text-xs">24/7 Support</Badge>
                </div>
                <CardDescription className="text-xs sm:text-sm">Get in touch with us</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <address className="not-italic">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <a
                    href="tel:+919896859767"
                    className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground gap-2 h-9 sm:h-10 text-xs sm:text-sm px-3"
                    aria-label="Call us at +91 98968-59767"
                  >
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">+91 98968-59767</span>
                  </a>
                  <a
                    href="mailto:contactadworld@gmail.com"
                    className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground gap-2 h-9 sm:h-10 text-xs sm:text-sm px-3"
                    aria-label="Email us at contactadworld@gmail.com"
                  >
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">contactadworld@gmail.com</span>
                  </a>
                  <div
                    className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground gap-2 h-9 sm:h-10 text-xs sm:text-sm px-3"
                    aria-label="Our location: Hisar, Haryana, India"
                  >
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Hisar (Haryana)</span>
                  </div>
                </div>
              </address>
            </CardContent>
          </Card>
        </div>

        {/* Footer Bottom */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                <span itemProp="copyrightHolder">Administrative World</span> All Rights Reserved,
                <time dateTime="2018" itemProp="copyrightYear">2018</time>
              </p>
              <div className="flex gap-2 sm:gap-3">
                <Badge
                  variant="outline"
                  className="text-xs"
                  aria-label={`${metaData ? metaData.totalStoreItems : 'N/A'} books available`}
                >
                  <Book className="h-3 w-3 mr-1" aria-hidden="true" /> {metaData ? metaData.totalStoreItems : 'N/A'}+ Books
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs"
                  aria-label={`${metaData ? metaData.totalRegisteredStudent : 'N/A'} registered users`}
                >
                  <Users className="h-3 w-3 mr-1" aria-hidden="true" /> {metaData ? metaData.totalRegisteredStudent : 'N/A'}+ Users
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
};

export default Footer;