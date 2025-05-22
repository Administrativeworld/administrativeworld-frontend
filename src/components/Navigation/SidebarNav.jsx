import { useSelector } from "react-redux";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu } from "../ui/sidebar";
import { adminNavLinks, adminToolsLinks } from "@/configs/Site";
import { useNavigate } from "react-router-dom";

function SidebarNav() {
  const navigate = useNavigate();
  const { user, loggedIn } = useSelector(state => state.authUser);


  // if (loggedIn || !loggedIn) {
  //   if (user.accountType !== 'Admin') {

  //   }
  // }
  if (loggedIn && user.accountType === 'Admin') {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <span className="font-bold text-xl pt-4 px-4">Admin Panel</span>
          </SidebarHeader>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="">
                {adminNavLinks.map((link, index) => (
                  <div key={index} className={`flex items-center gap-2 py-2 px-4 hover:bg-background cursor-pointer ${location.pathname === link.path && 'backdrop-brightness-200 border'} rounded-md`} onClick={() => { navigate(link.path) }}>
                    {link.icon}
                    <span>{link.title}</span>
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarFooter className='mt-auto'>
            <SidebarGroup>
              <SidebarGroupContent>
                {adminToolsLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 py-2 px-4 hover:bg-background rounded-md cursor-pointer">
                    {link.icon}
                    <span>{link.title}</span>
                  </div>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    );
  }
  return (
    null
  );
}

export default SidebarNav;
