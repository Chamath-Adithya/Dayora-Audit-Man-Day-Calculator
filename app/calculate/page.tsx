import { MainLayout } from "@/components/main-layout"
import CalculationFormFixed from "@/components/calculation-form-fixed"

export default function CalculatePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Calculation</h1>
          <p className="text-muted-foreground">
            Enter the details below to calculate audit man-days based on international standards.
          </p>
        </div>
        <CalculationFormFixed />
      </div>
    </MainLayout>
  )
}
