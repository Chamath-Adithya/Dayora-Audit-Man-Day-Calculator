"use client"

import { MainLayout } from "@/components/main-layout"
import { AdminConfiguration } from "@/components/admin-configuration"

export default function AdminPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Configuration</h1>
          <p className="text-muted-foreground">Configure base values and parameters for audit calculations.</p>
        </div>
        <AdminConfiguration />
      </div>
    </MainLayout>
  )
}