import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "../ui/breadcrumb";
import { Slash } from "lucide-react";


function Courses() {
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = "/admin/";
  const pathSegments = location.pathname.replace(basePath, "").split("/").filter(Boolean);
  return (
    <div>

      <div className="p-2 mb-3">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center space-x-1">
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate(basePath)} className="cursor-pointer text-blue-500 hover:underline">
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathSegments.map((segment, index) => {
              // Create a path that removes all segments after the clicked one
              const pathTo = `${basePath}${pathSegments.slice(0, index + 1).join("/")}`;
              const isLast = index === pathSegments.length - 1;

              return (
                <div key={pathTo} className="flex items-center space-x-1">
                  <Slash size={10} />
                  <BreadcrumbItem>
                    {!isLast ? (
                      <BreadcrumbLink onClick={() => navigate(pathTo)} className="cursor-pointer text-blue-500 hover:underline">
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                      </BreadcrumbLink>
                    ) : (
                      <span className="text-gray-500">{segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* {
        location.pathname === '/administrativeworld/admin/course/create' ? (
          <div className="">
            <Outlet />
          </div>
        ) : (
          <Outlet
          />
        )
      } */}
      <Outlet />

    </div>
  )
}

export default Courses