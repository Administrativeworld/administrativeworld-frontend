import { useSelector } from "react-redux";
import { navBarDefaultLinks } from "@/configs/Site";
import { useTheme } from "@/style/ThemeContext";
import { CircleUserRound, LogIn, MonitorCog, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useNavigation } from "react-router-dom";
import DialogMenu from "./DialogMenu";

function NavBar() {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  const { loggedIn, user } = useSelector((state) => state.authUser);


  return (
    <div className="flex items-center w-full flex-wrap md:flex-nowrap">
      {/* Left Side (Logo & Text) */}
      <div className="flex items-center gap-1 ml-2 md:gap-4 cursor-pointer" onClick={() => { navigate('/home') }}>
        <div className="w-8 sm:w-8">
          <img src="/android-chrome-192x192.png" alt="Logo" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm md:text-base lg:text-xl font-medium">Administrative World</span>
          <span className="text-[10px] mt-[-3px]">Your Dreams, Our Efforts!</span>
        </div>
      </div>

      {/* Right Side (Nav Buttons) */}
      <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0 ml-auto">
        <div className="hidden md:flex">
          {navBarDefaultLinks.map((item, index) => (
            <span key={index} className="font-medium mx-3 cursor-pointer hover:underline" onClick={() => { navigate(item.path) }}>
              {item.title}
            </span>
          ))}

        </div>
        {
          loggedIn && user && user.accountType === "Admin" &&
          <Button variant="outline" size="icon" onClick={() => { navigate("/admin") }}>
            {
              <MonitorCog />
            }
          </Button>
        }
        {
          loggedIn && user &&
          <Button
            size="icon" variant="outline"
            onClick={() => navigate("/home/user")}
          ><CircleUserRound /></Button>
        }
        {/* Theme Toggle */}

        <Button size="icon" variant="outline" onClick={toggleTheme}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>

        {
          <div className="block md:hidden">
            <DialogMenu />
          </div>
        }
        {!loggedIn && (
          <div className="">
            <Button size="icon" variant="outline" onClick={() => navigate('/login')}>
              <LogIn />
            </Button>
          </div>
        )}


      </div>
    </div >
  );

}




export default NavBar;
