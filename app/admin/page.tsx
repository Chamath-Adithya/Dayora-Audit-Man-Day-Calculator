"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { AdminConfiguration } from "@/components/admin-configuration"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield } from "lucide-react"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/auth/signin?callbackUrl=/admin")
      return
    }

    if (session.user.role !== "admin") {
      router.push("/")
      return
    }
  }, [session, status, router])

  // Show loading state
  if (status === "loading") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Show unauthorized message
  if (!session || session.user.role !== "admin") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                You don't have permission to access the admin area.
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact your administrator if you believe this is an error.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  // Show admin content for authorized users
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Configuration</h1>
            <p className="text-muted-foreground">Configure base values and parameters for audit calculations.</p>
          </div>
        </div>
        <AdminConfiguration />
      </div>
    </MainLayout>
  )
}
