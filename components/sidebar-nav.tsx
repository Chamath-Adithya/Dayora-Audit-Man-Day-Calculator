"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, Home, History, Settings, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "New Calculation", href: "/calculate", icon: Calculator },
  { name: "Results", href: "/results", icon: FileText },
  { name: "History", href: "/history", icon: History },
  { name: "Admin", href: "/admin", icon: Settings },
]

interface SidebarNavProps {
  onClose?: () => void
}

export function SidebarNav({ onClose }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-sidebar-foreground">Dayora</h1>
          <span className="text-xs text-muted-foreground">Audit Calculator</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
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
      </nav>
    </div>
  )
}
