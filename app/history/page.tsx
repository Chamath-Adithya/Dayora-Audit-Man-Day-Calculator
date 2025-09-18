"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { HistoryManagement } from "@/components/history-management"
import { useEffect } from "react"

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </MainLayout>
    )
  }

  if (status === "authenticated") {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="slide-in-left">
            <h1 className="text-3xl font-bold text-foreground">Calculation History</h1>
            <p className="text-muted-foreground">View and manage your previous audit calculations.</p>
          </div>
          <div className="slide-in-up">
            <HistoryManagement />
          </div>
        </div>
      </MainLayout>
    )
  }

  return null
}