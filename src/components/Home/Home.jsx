// import DialogMenu from "../Navigation/DialogMenu"
import { Outlet } from "react-router-dom"
import NavBar from "../Navigation/NavBar"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import Footer from "../Navigation/Footer"

function Home() {
  return (
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
    </SidebarProvider>
  )
}

export default Home