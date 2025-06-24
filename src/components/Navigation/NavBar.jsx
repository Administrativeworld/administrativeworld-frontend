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
import { useNavigate, Link } from "react-router-dom";
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
    <header role="banner">
      <nav
        className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto ">
          <div className="flex h-14 items-center justify-between w-full">
            {/* Left Side - Logo Section */}
            <div className="flex items-center gap-2">
              <Link
                to="/home"
                className="flex items-center gap-2 cursor-pointer group transition-all duration-200 hover:opacity-80"
                aria-label="Administrative World - Go to homepage"
              >
                <div className="w-8 h-8">
                  <img
                    src="/android-chrome-192x192.png"
                    alt="Administrative World Logo"
                    className="w-full h-full object-contain"
                    width={32}
                    height={32}
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
              </Link>
            </div>

            {/* Right Side - Navigation and Actions */}
            <div className="flex items-center gap-1">
              {/* Desktop Navigation Links */}
              <ul className="hidden md:flex items-center gap-1 mr-2 list-none" role="menubar">
                {navBarDefaultLinks.map((item, index) => (
                  <li key={index} role="none">
                    <Link
                      to={item.path}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                      role="menuitem"
                      aria-label={`Navigate to ${item.title}`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* User Profile Menu */}
              {loggedIn && user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative"
                      aria-label={`User menu for ${user.name || 'User'}`}
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <CircleUserRound className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56" role="menu">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleNavigation("/home/user")}
                      role="menuitem"
                    >
                      <CircleUserRound className="mr-2 h-4 w-4" aria-hidden="true" />
                      Profile
                    </DropdownMenuItem>
                    {user.accountType === "Admin" && (
                      <DropdownMenuItem
                        onClick={() => handleNavigation("/admin")}
                        role="menuitem"
                      >
                        <MonitorCog className="mr-2 h-4 w-4" aria-hidden="true" />
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
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all group-hover:rotate-180 dark:-rotate-90 dark:scale-0" aria-hidden="true" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all group-hover:-rotate-180 dark:rotate-0 dark:scale-100" aria-hidden="true" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Open mobile navigation menu"
                      aria-expanded={isOpen}
                      aria-controls="mobile-menu"
                    >
                      <Menu className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80"
                    id="mobile-menu"
                    role="dialog"
                    aria-labelledby="mobile-menu-title"
                  >
                    <SheetHeader>
                      <SheetTitle id="mobile-menu-title" className="text-left">
                        Navigation Menu
                      </SheetTitle>
                    </SheetHeader>
                    <nav className="mt-6 space-y-4" role="navigation" aria-label="Mobile navigation">
                      {/* Mobile Navigation Links */}
                      <ul className="space-y-2 list-none" role="menu">
                        {navBarDefaultLinks.map((item, index) => (
                          <li key={index} role="none">
                            <Link
                              to={item.path}
                              className="inline-flex items-center justify-start w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start text-left"
                              onClick={() => setIsOpen(false)}
                              role="menuitem"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>

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
                          <Link
                            to="/home/user"
                            className="inline-flex items-center justify-start w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start"
                            onClick={() => setIsOpen(false)}
                          >
                            <CircleUserRound className="mr-2 h-4 w-4" aria-hidden="true" />
                            My Profile
                          </Link>
                          {user.accountType === "Admin" && (
                            <Link
                              to="/admin"
                              className="inline-flex items-center justify-start w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start"
                              onClick={() => setIsOpen(false)}
                            >
                              <MonitorCog className="mr-2 h-4 w-4" aria-hidden="true" />
                              Admin Panel
                            </Link>
                          )}
                        </div>
                      ) : (
                        <Link
                          to="/login"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                          Sign In
                        </Link>
                      )}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Login Button for Non-authenticated Users */}
              {!loggedIn && (
                <div className="hidden md:block">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                  >
                    <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;