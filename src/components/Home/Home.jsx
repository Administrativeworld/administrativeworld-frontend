// import DialogMenu from "../Navigation/DialogMenu"
import { Outlet, useLocation } from "react-router-dom"
import NavBar from "../Navigation/NavBar"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import Footer from "../Navigation/Footer"
import { Helmet } from "react-helmet"
import dynamicMetaDataSeo from "@/configs/dynamicMetaDataSeo"

function Home() {
  const location = useLocation();
  const currentUrl = `${import.meta.env.VITE_DOMAIN}${location.pathname}`;
  console.log(currentUrl)
  return (<>
    <Helmet>
      <title>{dynamicMetaDataSeo.home.title}</title>
      <meta name="description" content={dynamicMetaDataSeo.home.description} />
      <meta name="keywords" content={dynamicMetaDataSeo.home.keywords} />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
    <SidebarProvider>
      {/* <SidebarNav /> */}
      <SidebarInset>
        <main className="flex-grow">
          <div className="flex flex-1 flex-col">
            <div className="border-b p-2">
              <NavBar />
            </div>
            <div className="">
              <Outlet />
            </div>
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider></>
  )
}

export default Home