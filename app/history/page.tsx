import { MainLayout } from "@/components/main-layout"
import { HistoryManagement } from "@/components/history-management"

export default function HistoryPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calculation History</h1>
          <p className="text-muted-foreground">View and manage your previous audit calculations.</p>
        </div>
        <HistoryManagement />
      </div>
    </MainLayout>
  )
}
