
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
  LifeBuoy,
  BookCheck,
  BookOpen,
  Settings, LogOut, SquarePlus, FileEdit, Newspaper,
  NotepadTextIcon
} from "lucide-react";
const iconsSize = 20
export const adminNavLinks = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: <Home size={iconsSize} />,
  },
  {
    title: "Courses",
    path: "/admin/course",
    icon: <Notebook size={iconsSize} />,
  },
  {
    title: "Books",
    path: "/admin/books",
    icon: <BookCheck size={iconsSize} />,
  },
  {
    title: "Articles",
    path: "/admin/article",
    icon: <NotepadTextIcon size={iconsSize} />
  },
  {
    title: "Coupon",
    path: "/admin/coupon",
    icon: <FileText size={iconsSize} />,
  },
  {
    title: "Category",
    path: "/admin/category",
    icon: <List size={iconsSize} />,
  },
  {
    title: "User Insights",
    path: "",
    icon: <Users size={iconsSize} />,
  },
  {
    title: "Enroll",
    path: "/admin/enrolluser",
    icon: <BookOpen size={iconsSize} />,
  },
  {
    title: "Post",
    path: "",
    icon: <Edit size={iconsSize} />,
  },
  {
    title: "Transactions",
    path: "",
    icon: <DollarSign size={iconsSize} />,
  },
  {
    title: "Statics",
    path: "",
    icon: <BarChart size={iconsSize} />,
  },
];

export const adminToolsLinks = [
  {
    title: "Settings",
    path: "",
    icon: <Settings size={iconsSize} />,
  },
  {
    title: "Logout",
    path: "",
    icon: <LogOut size={iconsSize} />,
  },
];
export const adminNavBarLinks = [
  {
    title: "Settings",
    path: "",
    icon: <Bell />,
  },
];
export const adminCourseManagement = [
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

export const adminArticleManagement = [
  {
    title: "Create New Article",
    description: "Start writing and publishing SEO-friendly articles to engage your audience and improve search visibility.",
    icon: <SquarePlus className="h-6 w-6" />,
    path: "/admin/article/create",
    features: [
      "Rich Text Editor",
      "SEO Meta Tags",
      "Category & Tag Management"
    ],
    buttonText: "Create New Article",
    variant: "primary",
    bgColor: "from-primary/5 to-transparent",
    iconBg: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
    badgeColor: "bg-green-500"
  },
  {
    title: "Draft Articles",
    description: "Manage and edit articles saved as drafts. Continue writing or prepare them for publishing anytime.",
    icon: <FileEdit className="h-6 w-6" />,
    path: "/admin/article/draft",
    features: [
      "Autosave Drafts",
      "Quick Editing",
      "Preview Articles"
    ],
    buttonText: "View Drafts",
    variant: "secondary",
    bgColor: "from-orange/10 to-transparent",
    iconBg: "bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white",
    badgeColor: "bg-orange-500"
  },
  {
    title: "Published Articles",
    description: "View and manage all live articles. Track their views, update content, or unpublish if needed.",
    icon: <Newspaper className="h-6 w-6" />,
    path: "/admin/article/published",
    features: [
      "Live Article Management",
      "View Analytics (Views)",
      "SEO Performance Updates"
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


