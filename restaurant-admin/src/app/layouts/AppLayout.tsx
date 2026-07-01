import { useState, useEffect } from "react"
import { Outlet } from "react-router"
import { Sidebar, Header } from "../components/layout/ShellComponents"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../components/ui/sheet"

export default function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(false)
      }
    }
    
    // Initial check
    handleResize()
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed)
    }
  }

  // Close mobile menu when route changes (simplified for now by just letting the user click overlay)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 z-20 h-full">
        <Sidebar collapsed={isSidebarCollapsed} />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 border-none">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Main application navigation menu</SheetDescription>
          <Sidebar collapsed={false} className="w-full border-r-0" />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
        
        <main className="flex-1 overflow-auto bg-muted/20 relative">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 w-full h-full">
            {/* The page components will be rendered here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}