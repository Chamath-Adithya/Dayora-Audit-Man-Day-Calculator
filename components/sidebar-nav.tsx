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

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-sidebar to-sidebar/90 border-r border-sidebar-border/50 shadow-modern-lg">
      <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border/50 bg-gradient-to-r from-sidebar to-sidebar/95">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 shadow-modern">
            <div className="w-2 h-2 bg-gradient-to-br from-primary to-accent rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dayora</h1>
            <span className="text-xs text-muted-foreground font-medium">Audit Calculator</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden hover:bg-sidebar-accent transition-all duration-300"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
      </div>
      <nav className="flex-1 space-y-2 p-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-modern glow-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 hover:shadow-modern",
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-all duration-300",
                isActive ? "text-white" : "text-primary group-hover:text-accent group-hover:rotate-12"
              )} />
              <span className="truncate">{item.name}</span>
              {isActive && (
                <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
              )}
            </Link>
          )
        })}

        {/* Admin Navigation - Only show for admin users */}
        {userRole === 'admin' && (
          <>
            <div className="border-t border-sidebar-border pt-4 mt-4">
              <div className="text-xs font-medium text-muted-foreground px-3 mb-2 uppercase tracking-wider">
                Administration
              </div>
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
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
