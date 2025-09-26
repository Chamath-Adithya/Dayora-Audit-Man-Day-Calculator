"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { FormulasTab } from "@/components/formulas-tab"
import { useEffect } from "react"

export default function FormulasPage() {
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading formulas...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (status === "authenticated") {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="slide-in-left">
            <h1 className="text-3xl font-bold text-foreground">Formulas</h1>
            <p className="text-muted-foreground">Complete reference for all calculation formulas and standards.</p>
          </div>
          <div className="slide-in-up">
            <FormulasTab />
          </div>
        </div>
      </MainLayout>
    )
  }

  return null
}
