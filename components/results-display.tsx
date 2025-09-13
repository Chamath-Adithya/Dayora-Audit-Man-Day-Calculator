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
    // Try to get data from URL parameters first, then localStorage as fallback
    const urlParams = new URLSearchParams(window.location.search)
    const dataParam = urlParams.get('data')
    
    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam)) as CalculationData
        setCalculationData(data)
        setResult(calculateAuditManDays(data))
        return
      } catch (error) {
        console.error('Error parsing URL data:', error)
      }
    }
    
    // Fallback to localStorage
    const storedData = localStorage.getItem("calculationData")
    if (storedData) {
      try {
        const data = JSON.parse(storedData) as CalculationData
        setCalculationData(data)
        setResult(calculateAuditManDays(data))
      } catch (error) {
        console.error('Error parsing localStorage data:', error)
      }
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
        alert(`Failed to save calculation: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const handleExportPDF = async () => {
    if (!calculationData || !result) return

    try {
      const { jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')
      
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Add title
      pdf.setFontSize(20)
      pdf.text('Audit Man-Day Calculation Report', pageWidth / 2, 20, { align: 'center' })
      
      // Add company information
      pdf.setFontSize(12)
      pdf.text(`Company: ${calculationData.companyName}`, 20, 40)
      pdf.text(`Scope: ${calculationData.scope}`, 20, 50)
      pdf.text(`Standard: ${calculationData.standard}`, 20, 60)
      pdf.text(`Audit Type: ${calculationData.auditType}`, 20, 70)
      pdf.text(`Category: ${calculationData.category}`, 20, 80)
      pdf.text(`Employees: ${calculationData.employees}`, 20, 90)
      pdf.text(`Sites: ${calculationData.sites}`, 20, 100)
      pdf.text(`Risk Level: ${calculationData.riskLevel}`, 20, 110)
      
      // Add calculation results
      pdf.setFontSize(16)
      pdf.text('Calculation Results', 20, 130)
      
      pdf.setFontSize(12)
      pdf.text(`Total Man-Days: ${result.totalManDays}`, 20, 145)
      
      // Add breakdown
      pdf.text('Breakdown:', 20, 160)
      pdf.text(`• Base Man-Days: ${result.breakdown.baseManDays}`, 30, 170)
      pdf.text(`• Employee Adjustment: ${result.breakdown.employeeAdjustment}`, 30, 180)
      pdf.text(`• Risk Adjustment: ${result.breakdown.riskAdjustment}`, 30, 190)
      pdf.text(`• Multi-Site Adjustment: ${result.breakdown.multiSiteAdjustment}`, 30, 200)
      pdf.text(`• Integrated System Adjustment: ${result.breakdown.integratedSystemAdjustment}`, 30, 210)
      
      // Add stage distribution if available
      if (result.stageDistribution) {
        pdf.text('Stage Distribution:', 20, 225)
        pdf.text(`• Stage 1: ${result.stageDistribution.stage1} days`, 30, 235)
        pdf.text(`• Stage 2: ${result.stageDistribution.stage2} days`, 30, 245)
      }
      
      // Add surveillance and recertification info
      if (result.surveillanceManDays) {
        pdf.text(`Surveillance: ${result.surveillanceManDays} days`, 20, 260)
      }
      if (result.recertificationManDays) {
        pdf.text(`Recertification: ${result.recertificationManDays} days`, 20, 270)
      }
      
      // Add footer
      pdf.setFontSize(10)
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pageHeight - 20)
      pdf.text('Dayora - Audit Man-Day Calculator', pageWidth - 20, pageHeight - 20, { align: 'right' })
      
      // Save the PDF
      pdf.save(`audit-calculation-${calculationData.companyName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const handleExportExcel = async () => {
    if (!calculationData || !result) return

    try {
      const { utils, writeFile } = await import('xlsx')
      
      // Prepare data for Excel
      const excelData = [
        ['Audit Man-Day Calculation Report'],
        [''],
        ['Company Information'],
        ['Company Name', calculationData.companyName],
        ['Scope', calculationData.scope],
        ['Standard', calculationData.standard],
        ['Audit Type', calculationData.auditType],
        ['Category', calculationData.category],
        ['Employees', calculationData.employees],
        ['Sites', calculationData.sites],
        ['Risk Level', calculationData.riskLevel],
        ['HACCP Studies', calculationData.haccpStudies || 0],
        ['Integrated Standards', (calculationData.integratedStandards || []).join(', ')],
        [''],
        ['Calculation Results'],
        ['Total Man-Days', result.totalManDays],
        [''],
        ['Breakdown'],
        ['Base Man-Days', result.breakdown.baseManDays],
        ['Employee Adjustment', result.breakdown.employeeAdjustment],
        ['HACCP Adjustment', result.breakdown.haccpAdjustment],
        ['Risk Adjustment', result.breakdown.riskAdjustment],
        ['Multi-Site Adjustment', result.breakdown.multiSiteAdjustment],
        ['Integrated System Adjustment', result.breakdown.integratedSystemAdjustment],
        [''],
        ['Additional Information'],
        ['Employee Range', result.details.employeeRange],
        ['Category Description', result.details.categoryDescription],
        ['Risk Multiplier', result.details.riskMultiplier],
        ['Integrated System Reduction', result.details.integratedSystemReduction]
      ]
      
      // Add stage distribution if available
      if (result.stageDistribution) {
        excelData.push([''])
        excelData.push(['Stage Distribution'])
        excelData.push(['Stage 1', result.stageDistribution.stage1])
        excelData.push(['Stage 2', result.stageDistribution.stage2])
      }
      
      // Add surveillance and recertification info
      if (result.surveillanceManDays) {
        excelData.push([''])
        excelData.push(['Surveillance Man-Days', result.surveillanceManDays])
      }
      if (result.recertificationManDays) {
        excelData.push(['Recertification Man-Days', result.recertificationManDays])
      }
      
      // Add metadata
      excelData.push([''])
      excelData.push(['Generated on', new Date().toLocaleDateString()])
      excelData.push(['Generated by', 'Dayora - Audit Man-Day Calculator'])
      
      // Create workbook and worksheet
      const ws = utils.aoa_to_sheet(excelData)
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, 'Audit Calculation')
      
      // Save the Excel file
      writeFile(wb, `audit-calculation-${calculationData.companyName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error('Error generating Excel file:', error)
      alert('Failed to generate Excel file. Please try again.')
    }
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
