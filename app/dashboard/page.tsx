"use client"

import { MainLayout } from "@/components/main-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Charts } from "@/components/dashboard/charts"

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="slide-in-left">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">An overview of your audit calculation data.</p>
        </div>
        <div className="space-y-6 slide-in-up">
          <StatsCards />
          <Charts />
        </div>
      </div>
    </MainLayout>
  )
}
