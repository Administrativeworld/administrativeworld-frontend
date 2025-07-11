import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { Slash } from "lucide-react";
import { adminArticleManagement } from "@/configs/Site";

function ArticlePanel() {
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


      <Outlet />
    </div>
  )
}

export default ArticlePanel