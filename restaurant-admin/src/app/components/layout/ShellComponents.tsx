import * as React from "react"
import { useLocation, Link } from "react-router"
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Truck, BookOpen, Layers, Users, BarChart3, Settings, LogOut, ChevronDown, Store, Menu, Search, Bell, Moon, Sun } from "lucide-react"

import { cn } from "../../../lib/utils"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Sheet, SheetContent } from "../ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb"
import { useTheme } from "next-themes"

// ----------------------------------------------------------------------------
// Sidebar Component
// ----------------------------------------------------------------------------

interface SidebarProps {
  collapsed: boolean
  className?: string
}

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { separator: true, name: "Operations" },
  { name: "Orders", icon: ShoppingBag, path: "/operations/orders" },
  { name: "Kitchen Queue", icon: UtensilsCrossed, path: "/operations/kitchen" },
  { name: "Delivery Queue", icon: Truck, path: "/operations/delivery" },
  { separator: true, name: "Menu Management" },
  { name: "Foods", icon: BookOpen, path: "/menu/foods" },
  { name: "Categories", icon: Layers, path: "/menu/categories" },
  { separator: true, name: "" },
  { name: "Customers", icon: Users, path: "/customers" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
]

export function Sidebar({ collapsed, className }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border transition-all duration-300", collapsed ? "w-[72px]" : "w-64", className)}>
      {/* Restaurant Switcher */}
      <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-between px-2", collapsed && "justify-center px-0")}>
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
                  <Store className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="flex flex-col items-start truncate">
                    <span className="text-sm font-semibold truncate">Downtown Branch</span>
                    <span className="text-xs text-muted-foreground truncate">Restaurant OS</span>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Store className="mr-2 h-4 w-4" /> Downtown Branch
              <CheckIcon active />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Store className="mr-2 h-4 w-4" /> Uptown Branch
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Store className="mr-2 h-4 w-4" /> Airport Terminal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 no-scrollbar">
        {navItems.map((item, index) => {
          if (item.separator) {
            return (
              <div key={index} className={cn("pt-4 pb-1", collapsed ? "px-0 text-center" : "px-3")}>
                {!collapsed && item.name && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.name}</p>
                )}
                {collapsed && <div className="w-6 h-px bg-border mx-auto my-2" />}
              </div>
            )
          }

          const isActive = location.pathname.startsWith(item.path as string);
          
          return (
            <Link key={item.path} to={item.path as string}>
              <div
                className={cn(
                  "flex items-center rounded-md transition-colors",
                  collapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 py-2 gap-3",
                  isActive
                    ? "bg-secondary text-secondary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={collapsed ? item.name : undefined}
              >
                {item.icon && <item.icon className="w-5 h-5 shrink-0" />}
                {!collapsed && <span className="text-sm truncate">{item.name}</span>}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border shrink-0 space-y-1">
        <Link to="/settings">
          <div className={cn(
            "flex items-center rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 py-2 gap-3",
            location.pathname.startsWith("/settings") && "bg-secondary text-secondary-foreground font-medium"
          )}
          title={collapsed ? "Settings" : undefined}>
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm truncate">Settings</span>}
          </div>
        </Link>
        <div className={cn(
          "flex items-center rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer",
          collapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 py-2 gap-3"
        )}
        title={collapsed ? "Logout" : undefined}>
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm truncate">Logout</span>}
        </div>
      </div>
    </div>
  )
}

function CheckIcon({ active }: { active?: boolean }) {
  if (!active) return null;
  return <div className="ml-auto w-2 h-2 rounded-full bg-primary" />;
}

// ----------------------------------------------------------------------------
// Header Component
// ----------------------------------------------------------------------------

export function Header({ toggleSidebar, isMobile }: { toggleSidebar: () => void, isMobile: boolean }) {
  const { setTheme, theme } = useTheme()
  const location = useLocation()
  
  // Basic breadcrumb generation based on pathname
  const paths = location.pathname.split('/').filter(Boolean)

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Desktop Sidebar Toggle (Optional, can be added if desired) */}
        {!isMobile && (
          <Button variant="ghost" size="icon" className="hidden lg:flex shrink-0 text-muted-foreground hover:text-foreground" onClick={toggleSidebar}>
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* Breadcrumbs */}
        <div className="hidden sm:block">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {paths.map((path, index) => {
                const isLast = index === paths.length - 1;
                const title = path.charAt(0).toUpperCase() + path.slice(1);
                const href = `/${paths.slice(0, index + 1).join('/')}`;
                
                return (
                  <React.Fragment key={path}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search orders, foods..." 
            className="flex h-9 w-full rounded-md border border-input bg-muted/50 px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <div className="absolute right-1.5 top-2 hidden sm:flex items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden shrink-0">
          <Search className="w-5 h-5" />
        </Button>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative shrink-0">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border border-background"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <div className="p-3 border-b border-border/50 hover:bg-muted/50 cursor-default">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-status-delivered shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">New Order #402</p>
                    <p className="text-xs text-muted-foreground">Table 12 just placed an order.</p>
                    <p className="text-[10px] text-muted-foreground">2 mins ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 hover:bg-muted/50 cursor-default">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-status-pending shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Low Inventory</p>
                    <p className="text-xs text-muted-foreground">Tomatoes are running low.</p>
                    <p className="text-[10px] text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2 text-center">
              <Button variant="link" className="text-xs h-auto py-1">View all notifications</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?u=manager" alt="Manager" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Alex Manager</p>
                <p className="text-xs leading-none text-muted-foreground">
                  alex@restaurant.os
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}