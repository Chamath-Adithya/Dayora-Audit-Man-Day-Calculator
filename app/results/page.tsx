"use client"

import { MainLayout } from "@/components/main-layout"
import { ResultsDisplay } from "@/components/results-display"

export default function ResultsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="slide-in-left">
          <h1 className="text-3xl font-bold text-foreground">Calculation Results</h1>
          <p className="text-muted-foreground">View detailed breakdown of your audit man-day calculations.</p>
        </div>
        <div className="slide-in-up">
          <ResultsDisplay />
        </div>
      </div>
    </MainLayout>
  )
}