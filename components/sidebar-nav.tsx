"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, Home, History, Settings, FileText, X, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Calculation", href: "/calculate", icon: Calculator },
  { name: "Results", href: "/results", icon: FileText },
  { name: "History", href: "/history", icon: History },
]

const adminNavigation = [
  { name: "Admin", href: "/admin", icon: Settings },
]

interface SidebarNavProps {
  onClose?: () => void
  userRole?: string
}

export function SidebarNav({ onClose, userRole }: SidebarNavProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex h-full flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
        <div className={cn(
          "flex items-center gap-2 transition-all duration-200",
          isCollapsed && "justify-center w-full"
        )}>
          {!isCollapsed ? (
            <>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">D</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">Dayora</h1>
                <span className="text-xs text-muted-foreground">Audit Calculator</span>
              </div>
            </>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">D</span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex items-center gap-2",
          isCollapsed && "hidden"
        )}>
          <div className="hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Toggle sidebar</span>
              <div className="w-4 h-4 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
              </div>
            </Button>
          </div>
          <ThemeToggle />
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:translate-x-1",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>
              )}
            </Link>
          )
        })}

        {/* Admin Navigation - Only show for admin users */}
        {userRole === 'admin' && (
          <>
            <div className={cn(
              "border-t border-sidebar-border pt-4 mt-4",
              isCollapsed && "mx-2"
            )}>
              <div className="text-xs font-medium text-muted-foreground px-3 mb-2 uppercase tracking-wider">
                {!isCollapsed && "Administration"}
              </div>
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:translate-x-1",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                      isActive && "scale-110"
                    )} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </nav>
    </div>
  )
}
