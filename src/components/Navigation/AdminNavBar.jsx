import { useSelector } from 'react-redux';
import { navBarDefaultLinks } from '@/configs/Site';
import { useTheme } from '@/style/ThemeContext';
import { LogIn, Moon, PanelTopOpen, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import DialogMenu from './DialogMenu';
import { useSidebar } from '../ui/sidebar';
function AdminNavBar() {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();

  const { loggedIn } = useSelector((state) => state.authUser);
  return (
    <div className="flex items-center w-full flex-wrap md:flex-nowrap">
      {/* Left Side (Logo & Text) */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="w-8 sm:w-10">
          <img src="/android-chrome-192x192.png" alt="Logo" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm md:text-base lg:text-xl font-medium">
            Administrative World
          </span>
          <span className="text-xs mt-[-3px]">Your Dreams, Our Efforts!</span>
        </div>
      </div>

      {/* Right Side (Nav Buttons) */}
      <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0 ml-auto">
        <div className="hidden md:flex ">
          {navBarDefaultLinks.map((item, index) => (
            <span
              key={index}
              className="font-medium mx-3 cursor-pointer hover:underline "
              onClick={() => {
                navigate(item.path);
              }}
            >
              {item.title}
            </span>
          ))}
        </div>

        {/* Theme Toggle */}
        <div onClick={toggleTheme}>{theme === 'dark' ? <Sun /> : <Moon />}</div>

        {
          <div className="block md:hidden">
            <DialogMenu />
          </div>
        }
        {!loggedIn && (
          <div className="">
            <Button size="icon" onClick={() => navigate('/login')}>
              <LogIn />
            </Button>
          </div>
        )}

        <div
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? (
            <PanelTopOpen className="rotate-90" />
          ) : (
            <PanelTopOpen className="-rotate-90" />
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminNavBar;
