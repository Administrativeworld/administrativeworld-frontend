// HomeLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../Navigation/NavBar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import Footer from "../Navigation/Footer";
import { Helmet } from "react-helmet-async";
import dynamicMetaDataSeo from "@/configs/dynamicMetaDataSeo";

export default function HomeLayout() {
  const location = useLocation();
  const currentUrl = `${import.meta.env.VITE_DOMAIN}${location.pathname}`;

  return (
    <>
      <Helmet>
        <title>{dynamicMetaDataSeo.home.title}</title>
        <meta name="description" content={dynamicMetaDataSeo.home.description} />
        <meta name="keywords" content={dynamicMetaDataSeo.home.keywords} />
        <link rel="canonical" href={currentUrl} />
      </Helmet>
      <SidebarProvider>
        <SidebarInset>
          <main className="flex-grow">
            <div className="flex flex-col min-h-screen">
              <header className="border-b p-2">
                <NavBar />
              </header>
              <div className="flex-grow">
                <Outlet />
              </div>
              <Footer />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
