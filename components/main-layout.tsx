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

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarNav onClose={() => setSidebarOpen(false)} userRole={session?.user?.role} />
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4">
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
            {status === "authenticated" ? (
              <>
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
          <div className="container mx-auto p-4 lg:p-6 fade-in">{children}</div>
        </main>
      </div>
    </div>
  )
}
