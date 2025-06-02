
import {
  Home,
  FileText,
  List,
  Users,
  Edit,
  DollarSign,
  BarChart,
  Bell,
  Notebook,
  SquarePlus,
  LifeBuoy,
  BookCheck,
  BookOpen
} from "lucide-react";
import { Settings, LogOut } from "lucide-react";

export const adminNavLinks = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: <Home />,
  },
  {
    title: "Courses",
    path: "/admin/course",
    icon: <Notebook />,
  },
  {
    title: "Books",
    path: "/admin/books",
    icon: <BookCheck />,
  },
  {
    title: "Pages",
    path: "",
    icon: <FileText />,
  },
  {
    title: "Category",
    path: "/admin/category",
    icon: <List />,
  },
  {
    title: "User Insights",
    path: "",
    icon: <Users />,
  },
  {
    title: "Enroll",
    path: "/admin/enrolluser",
    icon: <BookOpen />,
  },
  {
    title: "Post",
    path: "",
    icon: <Edit />,
  },
  {
    title: "Transactions",
    path: "",
    icon: <DollarSign />,
  },
  {
    title: "Statics",
    path: "",
    icon: <BarChart />,
  },
];

export const adminToolsLinks = [
  {
    title: "Settings",
    path: "",
    icon: <Settings />,
  },
  {
    title: "Logout",
    path: "",
    icon: <LogOut />,
  },
];
export const adminNavBarLinks = [
  {
    title: "Settings",
    path: "",
    icon: <Bell />,
  },
];
export const adminCourseCardData = [
  {
    title: "Create New",
    description: "Start creating new courses with interactive content, assessments, and multimedia resources.",
    icon: <SquarePlus className="h-6 w-6" />,
    path: "/admin/course/create",
    features: [
      "Course Structure & Modules",
      "Interactive Content Creation",
      "Assessment & Quiz Builder"
    ],
    buttonText: "Create New Course",
    variant: "primary",
    bgColor: "from-primary/5 to-transparent",
    iconBg: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
    badgeColor: "bg-green-500"
  },
  {
    title: "Draft Courses",
    description: "Continue working on your draft courses. Edit, review, and prepare them for publication.",
    icon: <LifeBuoy className="h-6 w-6" />,
    path: "/admin/course/draft",
    features: [
      "Work in Progress Courses",
      "Auto-save & Version Control",
      "Preview & Testing Tools"
    ],
    buttonText: "View Drafts",
    variant: "secondary",
    bgColor: "from-orange/10 to-transparent",
    iconBg: "bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white",
    badgeColor: "bg-orange-500"
  },
  {
    title: "Published Courses",
    description: "Manage your live courses, track performance, and analyze student engagement and progress.",
    icon: <BookCheck className="h-6 w-6" />,
    path: "/admin/course/published",
    features: [
      "Live Course Management",
      "Analytics & Performance",
      "Student Progress Tracking"
    ],
    buttonText: "View Published",
    variant: "outline",
    bgColor: "from-secondary/10 to-transparent",
    iconBg: "bg-secondary/20 text-secondary-foreground group-hover:bg-secondary group-hover:text-secondary-foreground",
    badgeColor: "bg-blue-500"
  },
];


export const navBarDefaultLinks = [
  {
    title: "Home",
    path: "/home"
  },
  {
    title: "Courses",
    path: "/home/explore"
  },
  {
    title: "Store",
    path: "/home/store"
  },
  {
    title: "AboutUs",
    path: "about"
  },
  {
    title: "ContactUs",
    path: "contact"
  }


]


