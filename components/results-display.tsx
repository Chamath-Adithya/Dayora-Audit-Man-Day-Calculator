"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Calculator, Save } from "lucide-react"
import { calculateAuditManDays } from "@/lib/audit-calculator"
import Link from "next/link"

interface CalculationData {
  companyName: string
  scope: string
  standard: string
  auditType: string
  category: string
  employees: number
  sites: number
  haccpStudies: number
  riskLevel: string
  integratedStandards: string[]
}

export function ResultsDisplay() {
  const [calculationData, setCalculationData] = useState<CalculationData | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateAuditManDays> | null>(null)

  useEffect(() => {
    const storedData = localStorage.getItem("calculationData")
    if (storedData) {
      const data = JSON.parse(storedData) as CalculationData
      setCalculationData(data)
      setResult(calculateAuditManDays(data))
    }
  }, [])

  const handleSaveCalculation = async () => {
    if (calculationData && result) {
      try {
        const { apiClient } = await import("@/lib/api-client")
        const calculationToSave = {
          ...calculationData,
          result: result.totalManDays,
          breakdown: result.breakdown
        }
        console.log("Saving calculation:", calculationToSave)
        await apiClient.saveCalculation(calculationToSave)
        alert("Calculation saved to history!")
      } catch (error) {
        console.error("Failed to save calculation:", error)
        alert(`Failed to save calculation: ${error.message || 'Unknown error'}`)
      }
    }
  }

  const handleExportPDF = () => {
    // Placeholder for PDF export functionality
    alert("PDF export functionality would be implemented here")
  }

  const handleExportExcel = () => {
    // Placeholder for Excel export functionality
    alert("Excel export functionality would be implemented here")
  }

  if (!calculationData || !result) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No calculation data found.</p>
        <Link href="/calculate">
          <Button className="mt-4">
            <Calculator className="mr-2 h-4 w-4" />
            Start New Calculation
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Audit Calculation Results</CardTitle>
              <CardDescription>{calculationData.companyName}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-accent">{result.totalManDays}</div>
              <div className="text-sm text-muted-foreground">Total Man-Days</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Standard</div>
              <div className="font-medium">{calculationData.standard}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Audit Type</div>
              <div className="font-medium capitalize">{calculationData.auditType}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Category</div>
              <div className="font-medium">{calculationData.category}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Risk Level</div>
              <Badge variant={calculationData.riskLevel === "high" ? "destructive" : "secondary"}>
                {calculationData.riskLevel}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Breakdown</CardTitle>
          <CardDescription>Detailed breakdown of how the total man-days were calculated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Base Man-Days ({result.details.categoryDescription})</span>
              <span className="font-medium">{result.breakdown.baseManDays}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Employee Adjustment ({result.details.employeeRange})</span>
              <span className="font-medium">+{result.breakdown.employeeAdjustment}</span>
            </div>
            {calculationData.standard === "FSMS" && (
              <div className="flex justify-between items-center">
                <span>HACCP Studies ({calculationData.haccpStudies} studies)</span>
                <span className="font-medium">+{result.breakdown.haccpAdjustment}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>Risk Adjustment (×{result.details.riskMultiplier})</span>
              <span className="font-medium">
                {result.breakdown.riskAdjustment >= 0 ? "+" : ""}
                {result.breakdown.riskAdjustment.toFixed(1)}
              </span>
            </div>
            {calculationData.sites > 1 && (
              <div className="flex justify-between items-center">
                <span>Multi-site Adjustment ({calculationData.sites} sites)</span>
                <span className="font-medium">+{result.breakdown.multiSiteAdjustment}</span>
              </div>
            )}
            {calculationData.integratedStandards.length > 0 && (
              <div className="flex justify-between items-center">
                <span>
                  Integrated Systems ({calculationData.integratedStandards.length} standards, -
                  {(result.details.integratedSystemReduction * 100).toFixed(0)}%)
                </span>
                <span className="font-medium">{result.breakdown.integratedSystemAdjustment.toFixed(1)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Man-Days</span>
              <span>{result.totalManDays}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Distribution (for initial audits) */}
      {result.stageDistribution && (
        <Card>
          <CardHeader>
            <CardTitle>Stage Distribution</CardTitle>
            <CardDescription>Recommended distribution for initial certification audit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-accent">{result.stageDistribution.stage1}</div>
                <div className="text-sm text-muted-foreground">Stage 1 Audit</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-accent">{result.stageDistribution.stage2}</div>
                <div className="text-sm text-muted-foreground">Stage 2 Audit</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Audit Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Future Audit Requirements</CardTitle>
          <CardDescription>Estimated man-days for surveillance and recertification audits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-secondary">{result.surveillanceManDays}</div>
              <div className="text-sm text-muted-foreground">Surveillance Audit</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-secondary">{result.recertificationManDays}</div>
              <div className="text-sm text-muted-foreground">Recertification Audit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrated Standards */}
      {calculationData.integratedStandards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Integrated Standards</CardTitle>
            <CardDescription>Standards included in this integrated audit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {calculationData.integratedStandards.map((standard) => (
                <Badge key={standard} variant="outline">
                  {standard}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={handleSaveCalculation} variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Save Calculation
        </Button>
        <Button onClick={handleExportPDF} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button onClick={handleExportExcel} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
        <Link href="/calculate">
          <Button>
            <Calculator className="mr-2 h-4 w-4" />
            New Calculation
          </Button>
        </Link>
      </div>
    </div>
  )
}
