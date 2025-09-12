"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2, Eye, Download, Calendar, RefreshCw } from "lucide-react"
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
      const data = await apiClient.getCalculations()
      setCalculations(data)
      setFilteredCalculations(data)
    } catch (err) {
      console.error("Failed to load calculations:", err)
      setError("Failed to load calculations. Please try again.")
      // Fallback to localStorage
      const savedCalculations = JSON.parse(localStorage.getItem("savedCalculations") || "[]")
      setCalculations(savedCalculations)
      setFilteredCalculations(savedCalculations)
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
        await apiClient.deleteCalculation(id)
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

  const clearAllHistory = async () => {
    if (confirm("Are you sure you want to clear all calculation history? This action cannot be undone.")) {
      try {
        await apiClient.deleteAllCalculations()
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
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{calculations.length}</div>
            <div className="text-sm text-muted-foreground">Total Calculations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {calculations.reduce((sum, calc) => sum + calc.result, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Man-Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {new Set(calculations.map((calc) => calc.companyName)).size}
            </div>
            <div className="text-sm text-muted-foreground">Unique Companies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
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
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific calculations using the filters below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="flex gap-2">
              <Button onClick={handleExportHistory} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={clearAllHistory} variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
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
          {filteredCalculations.length === 0 ? (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
