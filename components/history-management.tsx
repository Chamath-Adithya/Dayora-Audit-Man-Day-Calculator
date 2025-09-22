"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Calendar,
  Building,
  FileText,
  AlertCircle,
  Loader2,
  Archive,
  RotateCcw,
  X
} from "lucide-react"
import { apiClient, SavedCalculation } from "@/lib/api-client"
import Link from "next/link"
import { toast } from "sonner"

export function HistoryManagement() {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([])
  const [filteredCalculations, setFilteredCalculations] = useState<SavedCalculation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [standardFilter, setStandardFilter] = useState("all")
  const [auditTypeFilter, setAuditTypeFilter] = useState("all")
  const [showDeleted, setShowDeleted] = useState(false)
  const [selectedCalculations, setSelectedCalculations] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)

  const loadCalculations = async () => {
    setLoading(true)
    try {
      const data = showDeleted 
        ? await apiClient.getAllCalculations()
        : await apiClient.getCalculations()
      setCalculations(data)
      setFilteredCalculations(data)
    } catch (error) {
      console.error("Failed to load calculations:", error)
      toast.error("Failed to load calculation history")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalculations()
  }, [showDeleted])

  useEffect(() => {
    let filtered = calculations

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(calc =>
        calc.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.scope.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply standard filter
    if (standardFilter !== "all") {
      filtered = filtered.filter(calc => calc.standard === standardFilter)
    }

    // Apply audit type filter
    if (auditTypeFilter !== "all") {
      filtered = filtered.filter(calc => calc.auditType === auditTypeFilter)
    }

    setFilteredCalculations(filtered)
  }, [calculations, searchTerm, standardFilter, auditTypeFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to move this calculation to trash?")) return
    
    try {
      await apiClient.deleteCalculation(id)
      toast.success("Calculation moved to trash")
      loadCalculations()
    } catch (error) {
      toast.error("Failed to delete calculation")
    }
  }

  const handleRestore = async (id: string) => {
    try {
      await apiClient.restoreCalculation(id)
      toast.success("Calculation restored")
      loadCalculations()
    } catch (error) {
      toast.error("Failed to restore calculation")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCalculations.length === 0) return
    if (!confirm(`Are you sure you want to move ${selectedCalculations.length} calculations to trash?`)) return

    try {
      await Promise.all(selectedCalculations.map(id => apiClient.deleteCalculation(id)))
      toast.success(`${selectedCalculations.length} calculations moved to trash`)
      setSelectedCalculations([])
      loadCalculations()
    } catch (error) {
      toast.error("Failed to delete calculations")
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await apiClient.exportCalculations({
        standard: standardFilter !== "all" ? standardFilter : undefined,
        auditType: auditTypeFilter !== "all" ? auditTypeFilter : undefined,
        searchTerm: searchTerm || undefined,
      })
      toast.success("Export completed successfully")
    } catch (error) {
      toast.error("Failed to export calculations")
    } finally {
      setIsExporting(false)
    }
  }

  const toggleCalculationSelection = (id: string) => {
    setSelectedCalculations(prev =>
      prev.includes(id)
        ? prev.filter(calcId => calcId !== id)
        : [...prev, id]
    )
  }

  const selectAllCalculations = () => {
    if (selectedCalculations.length === filteredCalculations.length) {
      setSelectedCalculations([])
    } else {
      setSelectedCalculations(filteredCalculations.map(calc => calc.id))
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStandardFilter("all")
    setAuditTypeFilter("all")
  }

  const uniqueStandards = [...new Set(calculations.map(calc => calc.standard))]
  const uniqueAuditTypes = [...new Set(calculations.map(calc => calc.auditType))]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Loading History</h3>
          <p className="text-muted-foreground">Fetching your calculation history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Calculations</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{calculations.filter(c => !c.isDeleted).length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Man-Days</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {calculations.filter(c => !c.isDeleted).reduce((sum, calc) => sum + calc.result, 0)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Companies</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {new Set(calculations.filter(c => !c.isDeleted).map(c => c.companyName)).size}
                </p>
              </div>
              <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Man-Days</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {calculations.filter(c => !c.isDeleted).length > 0 
                    ? Math.round(calculations.filter(c => !c.isDeleted).reduce((sum, calc) => sum + calc.result, 0) / calculations.filter(c => !c.isDeleted).length)
                    : 0
                  }
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Calculation History
              </CardTitle>
              <CardDescription>
                Manage and review your audit calculations
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleted(!showDeleted)}
                className="flex items-center gap-2"
              >
                {showDeleted ? <Eye className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                {showDeleted ? "Show Active" : "Show Trash"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadCalculations}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies or scope..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={standardFilter} onValueChange={setStandardFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Standards</SelectItem>
                {uniqueStandards.map(standard => (
                  <SelectItem key={standard} value={standard}>{standard}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={auditTypeFilter} onValueChange={setAuditTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by audit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audit Types</SelectItem>
                {uniqueAuditTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCalculations.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedCalculations.length} calculation{selectedCalculations.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCalculations([])}
                >
                  Clear Selection
                </Button>
                {!showDeleted && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Move to Trash
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {filteredCalculations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {calculations.length === 0 ? "No calculations found" : "No results match your filters"}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {calculations.length === 0 
                ? "Start by creating your first audit calculation."
                : "Try adjusting your search terms or filters."
              }
            </p>
            {calculations.length === 0 ? (
              <Link href="/calculate">
                <Button>Create First Calculation</Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedCalculations.length === filteredCalculations.length}
                        onChange={selectAllCalculations}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Standard</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalculations.map((calculation) => (
                    <TableRow 
                      key={calculation.id}
                      className={`hover:bg-muted/50 transition-colors ${calculation.isDeleted ? 'opacity-60' : ''}`}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedCalculations.includes(calculation.id)}
                          onChange={() => toggleCalculationSelection(calculation.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{calculation.companyName}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {calculation.scope}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{calculation.standard}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{calculation.auditType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{calculation.category}</Badge>
                      </TableCell>
                      <TableCell>{calculation.employees}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            calculation.riskLevel === "high" ? "destructive" :
                            calculation.riskLevel === "medium" ? "default" : "secondary"
                          }
                        >
                          {calculation.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {calculation.result} days
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(calculation.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/results?id=${calculation.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {calculation.isDeleted ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestore(calculation.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(calculation.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}