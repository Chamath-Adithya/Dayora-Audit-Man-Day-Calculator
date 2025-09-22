"use client"

import type React from "react"
import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { SidebarNav } from "./sidebar-nav"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Loading Dayora</h2>
              <p className="text-muted-foreground">Preparing your audit calculator...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background page-transition">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarNav onClose={() => setSidebarOpen(false)} userRole={session?.user?.role} />
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <h1 className="text-lg font-semibold lg:hidden">Dayora</h1>
          <div className="flex items-center gap-4 ml-auto">
            {status === "loading" && (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === "authenticated" ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online
                </div>
                <span className="text-sm font-medium">{session.user?.name || session.user?.email}</span>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => signIn()}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 lg:p-6 page-transition">{children}</div>
        </main>
      </div>
    </div>
  )
}
