
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
    imgSrc: "/disableNotebook.png",
    altText: "Disable Notebook",
    buttonText: "Create New",
    icon: <SquarePlus />,
    path: "/admin/course/create"
  },
  {
    imgSrc: "/draft.png",
    altText: "Draft",
    buttonText: "Draft",
    icon: <LifeBuoy />,
    path: "/admin/course/draft"
  },
  {
    imgSrc: "/Notebook.png",
    altText: "Notebook",
    buttonText: "Published",
    icon: <BookCheck />,
    path: "/admin/course/published"
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


