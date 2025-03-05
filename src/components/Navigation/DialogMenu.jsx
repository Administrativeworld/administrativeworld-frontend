import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { navBarDefaultLinks } from "@/configs/Site";
import { Menu, SquareArrowOutUpRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DialogMenu() {
  const navigate = useNavigate();
  const { loggedIn } = useSelector((state) => state.authUser);

  return (
    <Dialog>
      {/* Menu Button - Adjusted for small screens */}
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-lg p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Menu size={18} className="sm:size-20" />
        </Button>
      </DialogTrigger>

      {/* Dialog Content - Now fully responsive */}
      <DialogContent className="w-[90vw] sm:max-w-md rounded-lg p-5 shadow-lg">
        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg sm:text-xl font-semibold">Administrative World</DialogTitle>
        </DialogHeader>

        {/* Divider */}
        <div className="border-t my-3"></div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-3">
          {navBarDefaultLinks.map((item, index) => (
            <DialogClose asChild key={index}>
              <div
                onClick={() => navigate(item.path)}
                className="flex items-center justify-between text-base sm:text-lg font-medium cursor-pointer px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <span>{item.title}</span>
                <SquareArrowOutUpRight size={16} />
              </div>
            </DialogClose>
          ))}

          {/* Login Button (If not logged in) */}
          {!loggedIn && (
            <Button
              onClick={() => navigate('/login')}
              className="mt-2 w-full font-semibold py-3"
            >
              Login
            </Button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t my-3"></div>

        {/* Footer - Button placed at the bottom for easier access */}
        <DialogFooter className="flex justify-center">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full py-3">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
