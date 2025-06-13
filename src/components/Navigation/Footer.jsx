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
import { data, useNavigate } from "react-router-dom";
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
    <footer className="min-h-screen bg-background border-t">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <Book className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span className="leading-tight">Administrative World</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Your Gateway to Knowledge and Excellence
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Badge className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Book className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Est. 2018</span>
              </Badge>
              <Badge variant="outline" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{metaData ? metaData.totalRegisteredStudent : 'N/A'}+ Users</span>
              </Badge>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Books Available</p>
                  <p className="text-lg sm:text-xl font-bold">{metaData ? metaData.totalStoreItems : 'N/A'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Paid Users</p>
                  <p className="text-lg sm:text-xl font-bold">{metaData ? metaData.totalRegisteredStudent : 'N/A'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Years Experience</p>
                  <p className="text-lg sm:text-xl font-bold">7+</p>
                </div>
              </div>
            </Card>

            <Card className="p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                  <HeartHandshake className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Support</p>
                  <p className="text-lg sm:text-xl font-bold">24/7</p>
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
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <Book className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Book Store</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Your Gateway to Knowledge</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Explore a wide range of books and resources dedicated to Public Administration. Whether you're a student, aspirant, or professional, our curated collection is designed to deepen your understanding of how public institutions work and evolve.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/home/store")}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Book className="h-4 w-4" />
                  Visit Store
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {/* Company Links */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  Company
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 sm:space-y-2">
                <TooltipProvider>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                    onClick={() => navigate("/home/about")}
                  >
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    About Us
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                    onClick={() => navigate("/home/contact")}
                  >
                    <GanttChartSquare className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    How to Contact?
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                    onClick={() => navigate("/home/explore")}
                  >
                    <Library className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    Popular Course
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                    onClick={() => navigate("/home/explore")}
                  >
                    <HeartHandshake className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    Service
                  </Button>
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* Courses */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  Courses
                  <Badge variant="outline" className="ml-2 text-xs">New</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 sm:space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                  onClick={() => navigate("/home/explore")}
                >
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  Courses
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 sm:space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                  onClick={() => navigate("/home/contact")}
                >
                  <BadgeHelp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info - Full Width Section */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Contact Info</CardTitle>
                  <Badge variant="secondary" className="text-xs">24/7 Support</Badge>
                </div>
                <CardDescription className="text-xs sm:text-sm">Get in touch with us</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <Button variant="outline" className="justify-start gap-2 h-9 sm:h-10 text-xs sm:text-sm">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">+91 98968-59767</span>
                </Button>
                <Button variant="outline" className="justify-start gap-2 h-9 sm:h-10 text-xs sm:text-sm">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">contactadworld@gmail.com</span>
                </Button>
                <Button variant="outline" className="justify-start gap-2 h-9 sm:h-10 text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Hisar (Haryana)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Bottom */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                Administrative World All Rights Reserved, 2018
              </p>
              <div className="flex gap-2 sm:gap-3">
                <Badge variant="outline" className="text-xs">
                  <Book className="h-3 w-3 mr-1" /> {metaData ? metaData.totalStoreItems : 'N/A'}+ Books
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" /> {metaData ? metaData.totalRegisteredStudent : 'N/A'}+ Users
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