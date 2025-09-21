"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Calculator, Save, Loader2, AlertCircle, RefreshCw, History } from "lucide-react"
import { calculateAuditManDays } from "@/lib/audit-calculator-fixed"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { apiClient, SavedCalculation } from "@/lib/api-client"

export function ResultsDisplay() {
  const searchParams = useSearchParams()
  const [calculation, setCalculation] = useState<SavedCalculation | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCalculation = useCallback(() => {
    const id = searchParams.get('id')
    if (id) {
      setLoading(true)
      setError(null)
      apiClient.getCalculation(id)
        .then(async (data) => {
          if (!data) {
            throw new Error("Calculation data is null or undefined.")
          }
          setCalculation(data)
          const calcResult = await calculateAuditManDays(data)
          setResult(calcResult)
        })
        .catch((err) => {
          console.error("Error fetching calculation:", err)
          setError("Failed to load calculation. The link may be invalid or there might be a network issue.")
        })
        .finally(() => setLoading(false))
    } else {
      setError("No calculation ID provided in the URL.")
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchCalculation()
  }, [fetchCalculation])

  const handleExportPDF = async () => {
    if (!calculation) return
    try {
      const response = await fetch(`/api/export?id=${calculation.id}`)
      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-calculation-${calculation.companyName.replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading calculation results...</p>
        <p className="text-sm text-muted-foreground">Please wait a moment.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto">
        <AlertCircle className="mx-auto h-16 w-16 mb-4 text-destructive" />
        <h2 className="text-2xl font-bold text-destructive mb-2">An Error Occurred</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={fetchCalculation}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/history">
            <Button variant="outline">
              <History className="mr-2 h-4 w-4" />
              Go to History
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!calculation || !result) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No calculation data available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-accent">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-primary">{calculation.companyName}</CardTitle>
                  <CardDescription className="text-lg">{calculation.scope}</CardDescription>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-5xl font-bold text-primary">{result.totalManDays}</div>
                  <div className="text-sm text-muted-foreground">Total Man-Days</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5"/>Calculation Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Base Man-Days ({result.details.categoryDescription})</span>
                <span className="font-medium text-lg">{result.breakdown.baseManDays}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Employee Adjustment ({result.details.employeeRange})</span>
                <span className="font-medium text-lg">+{result.breakdown.employeeAdjustment}</span>
              </div>
              {calculation.standard === "FSMS" && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">HACCP Studies ({calculation.haccpStudies} studies)</span>
                  <span className="font-medium text-lg">+{result.breakdown.haccpAdjustment}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Risk Adjustment (×{result.details.riskMultiplier})</span>
                <span className={`font-medium text-lg ${result.breakdown.riskAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.breakdown.riskAdjustment >= 0 ? "+" : ""}
                  {result.breakdown.riskAdjustment.toFixed(1)}
                </span>
              </div>
              {calculation.sites > 1 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Multi-site Adjustment ({calculation.sites} sites)</span>
                  <span className="font-medium text-lg">+{result.breakdown.multiSiteAdjustment}</span>
                </div>
              )}
              {calculation.integratedStandards.length > 0 && (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Integrated Standards:</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {calculation.integratedStandards.map((standard, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total Reduction: -{(result.details.integratedSystemReduction * 100).toFixed(0)}%
                    </span>
                    <span className="font-medium text-lg text-red-600">{result.breakdown.integratedSystemAdjustment.toFixed(1)}</span>
                  </div>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>Total Man-Days</span>
                <span>{result.totalManDays}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {result.stageDistribution && (
            <Card>
              <CardHeader>
                <CardTitle>Stage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">{result.stageDistribution.stage1}</div>
                    <div className="text-sm text-muted-foreground">Stage 1 Audit</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">{result.stageDistribution.stage2}</div>
                    <div className="text-sm text-muted-foreground">Stage 2 Audit</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Future Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-secondary">{result.surveillanceManDays}</div>
                  <div className="text-sm text-muted-foreground">Surveillance</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-secondary">{result.recertificationManDays}</div>
                  <div className="text-sm text-muted-foreground">Recertification</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Standard</span>
                <span className="font-medium">{calculation.standard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audit Type</span>
                <span className="font-medium capitalize">{calculation.auditType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{calculation.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Level</span>
                <Badge variant={calculation.riskLevel === "high" ? "destructive" : "secondary"}>
                  {calculation.riskLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center pt-6">
        <Button onClick={handleExportPDF} size="lg">
          <FileText className="mr-2 h-5 w-5" />
          Export PDF
        </Button>
        <Link href="/calculate">
          <Button size="lg" variant="outline">
            <Calculator className="mr-2 h-5 w-5" />
            New Calculation
          </Button>
        </Link>
      </div>
    </div>
  )
}
