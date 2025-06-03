import { useSelector } from "react-redux";
import { navBarDefaultLinks } from "@/configs/Site";
import { useTheme } from "@/style/ThemeContext";
import {
  CircleUserRound,
  LogIn,
  MonitorCog,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

function NavBar() {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { loggedIn, user } = useSelector((state) => state.authUser);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto ">
        <div className="flex h-14 items-center justify-between w-full">
          {/* Left Side - Logo Section */}
          <div
            className="flex items-center gap-2 cursor-pointer group transition-all duration-200 hover:opacity-80"
            onClick={() => handleNavigation('/home')}
          >
            <div className="w-8 h-8">
              <img
                src="/android-chrome-192x192.png"
                alt="Administrative World Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent leading-tight whitespace-nowrap">
                Administrative World
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground -mt-0.5 leading-none whitespace-nowrap">
                Your Dreams, Our Efforts!
              </span>
            </div>

          </div>

          {/* Right Side - Navigation and Actions */}
          <div className="flex items-center gap-1">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 mr-2">
              {navBarDefaultLinks.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.title}
                </Button>
              ))}
            </div>
            {/* Admin Panel Access */}


            {/* User Profile Menu */}
            {loggedIn && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <CircleUserRound className="h-4 w-4" />

                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation("/home/user")}>
                    <CircleUserRound className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user.accountType === "Admin" && (
                    <DropdownMenuItem onClick={() => handleNavigation("/admin")}>
                      <MonitorCog className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Theme Toggle */}
            <Button
              size="icon"
              variant="outline"
              onClick={toggleTheme}
              className="relative overflow-hidden group"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all group-hover:rotate-180 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all group-hover:-rotate-180 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="text-left">Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {/* Mobile Navigation Links */}
                    <div className="space-y-2">
                      {navBarDefaultLinks.map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-left"
                          onClick={() => handleNavigation(item.path)}
                        >
                          {item.title}
                        </Button>
                      ))}
                    </div>

                    <Separator />

                    {/* Mobile User Actions */}
                    {loggedIn && user ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 bg-accent rounded-lg">
                          <p className="text-sm font-medium">{user.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {user.accountType}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleNavigation("/home/user")}
                        >
                          <CircleUserRound className="mr-2 h-4 w-4" />
                          My Profile
                        </Button>
                        {user.accountType === "Admin" && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleNavigation("/admin")}
                          >
                            <MonitorCog className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleNavigation('/login')}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Login Button for Non-authenticated Users */}
            {!loggedIn && (
              <div className="hidden md:block">
                <Button size="sm" onClick={() => handleNavigation('/login')}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;