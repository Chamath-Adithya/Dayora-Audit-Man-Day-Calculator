"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2, Eye, Download, Calendar, RefreshCw, FileText } from "lucide-react"
import { format } from "date-fns"
import { apiClient, type SavedCalculation } from "@/lib/api-client"

export function HistoryManagement() {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([])
  const [filteredCalculations, setFilteredCalculations] = useState<SavedCalculation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [standardFilter, setStandardFilter] = useState("all")
  const [auditTypeFilter, setAuditTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCalculations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try API first
      try {
        const data = await apiClient.getCalculations()
        setCalculations(data)
        setFilteredCalculations(data)
        return
      } catch (apiError) {
        console.warn("API failed, trying localStorage:", apiError)
      }
      
      // Fallback to localStorage
      const savedCalculations = JSON.parse(localStorage.getItem("calculations") || "[]")
      setCalculations(savedCalculations)
      setFilteredCalculations(savedCalculations)
      
      if (savedCalculations.length === 0) {
        setError("No calculations found. Try creating a new calculation first.")
      }
    } catch (err) {
      console.error("Failed to load calculations:", err)
      setError("Failed to load calculations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalculations()
  }, [])

  useEffect(() => {
    let filtered = calculations

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (calc) =>
          calc.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          calc.scope.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply standard filter
    if (standardFilter !== "all") {
      filtered = filtered.filter((calc) => calc.standard === standardFilter)
    }

    // Apply audit type filter
    if (auditTypeFilter !== "all") {
      filtered = filtered.filter((calc) => calc.auditType === auditTypeFilter)
    }

    setFilteredCalculations(filtered)
  }, [calculations, searchTerm, standardFilter, auditTypeFilter])

  const handleDeleteCalculation = async (id: string) => {
    if (confirm("Are you sure you want to delete this calculation?")) {
      try {
        // Try API first
        try {
          await apiClient.deleteCalculation(id)
        } catch (apiError) {
          console.warn("API delete failed, using localStorage:", apiError)
          // Fallback to localStorage
          const savedCalculations = JSON.parse(localStorage.getItem("calculations") || "[]")
          const updatedCalculations = savedCalculations.filter((calc: any) => calc.id !== id)
          localStorage.setItem("calculations", JSON.stringify(updatedCalculations))
        }
        await loadCalculations() // Refresh the list
      } catch (err) {
        console.error("Failed to delete calculation:", err)
        alert("Failed to delete calculation. Please try again.")
      }
    }
  }

  const handleViewCalculation = (calculation: SavedCalculation) => {
    // Store the calculation data for viewing
    const calculationData = {
      companyName: calculation.companyName,
      scope: calculation.scope,
      standard: calculation.standard,
      auditType: calculation.auditType,
      category: calculation.category,
      employees: calculation.employees,
      sites: calculation.sites,
      haccpStudies: calculation.haccpStudies || 0,
      riskLevel: calculation.riskLevel,
      integratedStandards: calculation.integratedStandards || [],
    }
    localStorage.setItem("calculationData", JSON.stringify(calculationData))
    window.open("/results", "_blank")
  }

  const handleExportHistory = async () => {
    try {
      await apiClient.exportCalculations({
        standard: standardFilter !== "all" ? standardFilter : undefined,
        auditType: auditTypeFilter !== "all" ? auditTypeFilter : undefined,
        searchTerm: searchTerm || undefined
      })
    } catch (err) {
      console.error("Failed to export calculations:", err)
      alert("Failed to export calculations. Please try again.")
    }
  }

  const handleExportHistoryPDF = async () => {
    if (filteredCalculations.length === 0) {
      alert("No calculations to export.")
      return
    }

    try {
      const { jsPDF } = await import('jspdf')
      
      // Create a new PDF document
      const pdf = new jsPDF('l', 'mm', 'a4') // Landscape for better table layout
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Add title
      pdf.setFontSize(20)
      pdf.text('Audit Calculation History Report', pageWidth / 2, 20, { align: 'center' })
      
      // Add summary stats
      pdf.setFontSize(12)
      pdf.text(`Total Calculations: ${filteredCalculations.length}`, 20, 35)
      pdf.text(`Total Man-Days: ${filteredCalculations.reduce((sum, calc) => sum + calc.result, 0)}`, 20, 45)
      pdf.text(`Unique Companies: ${new Set(filteredCalculations.map(calc => calc.companyName)).size}`, 20, 55)
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 65)
      
      // Add table headers
      const tableHeaders = ['Date', 'Company', 'Standard', 'Type', 'Category', 'Employees', 'Risk', 'Result']
      const colWidths = [25, 40, 20, 25, 15, 20, 15, 20]
      let xPos = 20
      
      pdf.setFontSize(10)
      pdf.setFillColor(240, 240, 240)
      
      // Draw header row
      tableHeaders.forEach((header, index) => {
        pdf.rect(xPos, 80, colWidths[index], 8, 'F')
        pdf.text(header, xPos + 2, 85)
        xPos += colWidths[index]
      })
      
      // Draw data rows
      let yPos = 88
      filteredCalculations.forEach((calc, rowIndex) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage()
          yPos = 20
        }
        
        xPos = 20
        const rowData = [
          new Date(calc.date).toLocaleDateString(),
          calc.companyName.length > 25 ? calc.companyName.substring(0, 22) + '...' : calc.companyName,
          calc.standard,
          calc.auditType,
          calc.category,
          calc.employees.toString(),
          calc.riskLevel,
          calc.result.toString()
        ]
        
        rowData.forEach((data, index) => {
          pdf.rect(xPos, yPos, colWidths[index], 6)
          pdf.text(data, xPos + 2, yPos + 4)
          xPos += colWidths[index]
        })
        
        yPos += 6
      })
      
      // Add footer
      pdf.setFontSize(8)
      pdf.text('Dayora - Audit Man-Day Calculator', pageWidth - 20, pageHeight - 10, { align: 'right' })
      
      // Save the PDF
      pdf.save(`audit-history-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const clearAllHistory = async () => {
    if (confirm("Are you sure you want to clear all calculation history? This action cannot be undone.")) {
      try {
        // Try API first
        try {
          await apiClient.deleteAllCalculations()
        } catch (apiError) {
          console.warn("API clear failed, using localStorage:", apiError)
          // Fallback to localStorage
          localStorage.setItem("calculations", "[]")
        }
        await loadCalculations() // Refresh the list
      } catch (err) {
        console.error("Failed to clear history:", err)
        alert("Failed to clear history. Please try again.")
      }
    }
  }

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-destructive">{error}</div>
              <Button onClick={loadCalculations} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{calculations.length}</div>
            <div className="text-sm text-muted-foreground">Total Calculations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {calculations.reduce((sum, calc) => sum + calc.result, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Man-Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {new Set(calculations.map((calc) => calc.companyName)).size}
            </div>
            <div className="text-sm text-muted-foreground">Unique Companies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {calculations.length > 0
                ? Math.round(calculations.reduce((sum, calc) => sum + calc.result, 0) / calculations.length)
                : 0}
            </div>
            <div className="text-sm text-muted-foreground">Avg Man-Days</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find specific calculations using the filters below</CardDescription>
            </div>
            <Button onClick={loadCalculations} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search company or scope..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={standardFilter} onValueChange={setStandardFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Standards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Standards</SelectItem>
                  <SelectItem value="QMS">QMS</SelectItem>
                  <SelectItem value="EMS">EMS</SelectItem>
                  <SelectItem value="EnMS">EnMS</SelectItem>
                  <SelectItem value="FSMS">FSMS</SelectItem>
                  <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                </SelectContent>
              </Select>
              <Select value={auditTypeFilter} onValueChange={setAuditTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Audit Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Audit Types</SelectItem>
                  <SelectItem value="initial">Initial Certification</SelectItem>
                  <SelectItem value="surveillance">Surveillance</SelectItem>
                  <SelectItem value="recertification">Recertification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Action Buttons Row */}
            <div className="flex flex-wrap gap-2 justify-start sm:justify-start">
              <Button onClick={handleExportHistory} variant="outline" size="sm" className="flex-shrink-0">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
              </Button>
              <Button onClick={handleExportHistoryPDF} variant="outline" size="sm" className="flex-shrink-0">
                <FileText className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <Button 
                onClick={clearAllHistory} 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:text-destructive hover:bg-destructive hover:text-destructive-foreground flex-shrink-0"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation History</CardTitle>
          <CardDescription>
            {filteredCalculations.length} of {calculations.length} calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <RefreshCw className="mx-auto h-12 w-12 mb-4 animate-spin text-muted-foreground" />
              <p>Loading calculations...</p>
            </div>
          ) : filteredCalculations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {calculations.length === 0 ? (
                <div>
                  <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>No calculations saved yet.</p>
                  <p className="text-sm">Complete a calculation and save it to see it here.</p>
                </div>
              ) : (
                <p>No calculations match your current filters.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Audit Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalculations.map((calculation) => (
                      <TableRow key={calculation.id}>
                        <TableCell className="text-sm">{format(new Date(calculation.date), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="font-medium">{calculation.companyName}</TableCell>
                        <TableCell className="max-w-32 truncate" title={calculation.scope}>
                          {calculation.scope}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{calculation.standard}</Badge>
                        </TableCell>
                        <TableCell className="capitalize">{calculation.auditType}</TableCell>
                        <TableCell>{calculation.category}</TableCell>
                        <TableCell>{calculation.employees}</TableCell>
                        <TableCell>
                          <Badge variant={getRiskBadgeVariant(calculation.riskLevel)}>{calculation.riskLevel}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{calculation.result} days</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewCalculation(calculation)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteCalculation(calculation.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredCalculations.map((calculation) => (
                  <Card key={calculation.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{calculation.companyName}</h3>
                          <p className="text-xs text-muted-foreground truncate">{calculation.scope}</p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewCalculation(calculation)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteCalculation(calculation.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <p className="font-medium">{format(new Date(calculation.date), "MMM dd, yyyy")}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Result:</span>
                          <p className="font-semibold text-primary">{calculation.result} days</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Standard:</span>
                          <Badge variant="outline" className="text-xs">{calculation.standard}</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risk:</span>
                          <Badge variant={getRiskBadgeVariant(calculation.riskLevel)} className="text-xs">
                            {calculation.riskLevel}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="capitalize">{calculation.auditType}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <p>{calculation.category}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
