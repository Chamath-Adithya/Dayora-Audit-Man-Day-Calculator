"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Trash2, Eye, Download, Calendar, RefreshCw, FileText, BarChart2, ToggleLeft, ToggleRight, AlertTriangle, Archive, ArchiveRestore } from "lucide-react"
import { format } from "date-fns"
import { apiClient, type SavedCalculation } from "@/lib/api-client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HistoryManagement() {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([])
  const [filteredCalculations, setFilteredCalculations] = useState<SavedCalculation[]>([])
  const [selectedCalculations, setSelectedCalculations] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [standardFilter, setStandardFilter] = useState("all")
  const [auditTypeFilter, setAuditTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState("active")

  const loadCalculations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getAllCalculations()
      setCalculations(data)
      setSelectedCalculations([])
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
    let filtered = calculations.filter(c => view === 'active' ? !c.isDeleted : c.isDeleted)

    if (searchTerm) {
      filtered = filtered.filter(
        (calc) =>
          calc.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          calc.scope.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (standardFilter !== "all") {
      filtered = filtered.filter((calc) => calc.standard === standardFilter)
    }

    if (auditTypeFilter !== "all") {
      filtered = filtered.filter((calc) => calc.auditType === auditTypeFilter)
    }

    setFilteredCalculations(filtered)
  }, [calculations, searchTerm, standardFilter, auditTypeFilter, view])

  const handleToggleCalculation = async (id: string, isDeleted: boolean) => {
    try {
      await apiClient.updateCalculation(id, { isDeleted: !isDeleted })
      await loadCalculations()
    } catch (err) {
      const action = isDeleted ? "enable" : "disable"
      console.error(`Failed to ${action} calculation:`, err)
      alert(`Failed to ${action} calculation. Please try again.`)
    }
  }

  const handleDeletePermanently = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this calculation? This action cannot be undone.")) {
      try {
        await apiClient.deleteCalculationPermanently(id)
        await loadCalculations()
      } catch (err) {
        console.error("Failed to delete calculation:", err)
      alert(`Failed to delete calculation: ${err instanceof Error ? err.message : String(err)}`)
    }
    }
  }

  const handleBulkAction = async (action: "archive" | "restore" | "delete") => {
    const actionVerb = action === "archive" ? "archive" : action === "restore" ? "restore" : "permanently delete"
    if (confirm(`Are you sure you want to ${actionVerb} ${selectedCalculations.length} calculations?`)) {
      if (action === "archive") {
        if (confirm("Do you want to export a PDF of the selected calculations before archiving?")) {
          const calculationsToExport = calculations.filter(calc => selectedCalculations.includes(calc.id))
          await handleExportHistoryPDF(calculationsToExport)
        }
      }
      try {
        await Promise.all(selectedCalculations.map(id => {
          if (action === "archive") {
            return apiClient.updateCalculation(id, { isDeleted: true })
          } else if (action === "restore") {
            return apiClient.updateCalculation(id, { isDeleted: false })
          } else {
            return apiClient.deleteCalculation(id)
          }
        }))
        await loadCalculations()
      } catch (err) {
        console.error(`Failed to ${action} calculations:`, err)
        alert(`Failed to ${action} calculations. Please try again.`)
      }
    }
  }

  const handleViewCalculation = (id: string) => {
    window.open(`/results?id=${id}`, "_blank")
  }

  const handleExportHistoryPDF = async (calculationsToExport: SavedCalculation[] = filteredCalculations) => {
    if (calculationsToExport.length === 0) {
      alert("No calculations to export.")
      return
    }

    try {
      const response = await fetch('/api/export-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calculations: calculationsToExport }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-history-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
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

  const chartData = calculations.filter(c => !c.isDeleted).map(c => ({ name: c.companyName, manDays: c.result }));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCalculations(filteredCalculations.map(c => c.id))
    } else {
      setSelectedCalculations([])
    }
  }

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCalculations(prev => [...prev, id])
    } else {
      setSelectedCalculations(prev => prev.filter(calcId => calcId !== id))
    }
  }

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
            <CardTitle>History Overview</CardTitle>
            <CardDescription>A visual summary of your active calculation history.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="manDays" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="trash">Trash</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
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
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search company or scope..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Select value={standardFilter} onValueChange={setStandardFilter}>
                      <SelectTrigger className="w-full md:w-auto">
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
                      <SelectTrigger className="w-full md:w-auto">
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
                </div>
                
                <div className="flex flex-wrap gap-2 justify-start sm:justify-start">
                  <Button onClick={() => handleExportHistoryPDF()} variant="outline" size="sm" className="flex-shrink-0">
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Export PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </Button>
                  {selectedCalculations.length > 0 && (
                    <Button onClick={() => handleBulkAction("archive")} variant="outline" size="sm" className="flex-shrink-0">
                      <Archive className="mr-2 h-4 w-4" />
                      Archive ({selectedCalculations.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calculation History</CardTitle>
              <CardDescription>
                {filteredCalculations.length} of {calculations.filter(c => !c.isDeleted).length} calculations
              </CardDescription>
              <div className="lg:hidden flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="selectAllMobile"
                  checked={selectedCalculations.length === filteredCalculations.length && filteredCalculations.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="selectAllMobile" className="text-sm font-medium">Select All</label>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <RefreshCw className="mx-auto h-12 w-12 mb-4 animate-spin text-muted-foreground" />
                  <p>Loading calculations...</p>
                </div>
              ) : filteredCalculations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {calculations.filter(c => !c.isDeleted).length === 0 ? (
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
                  <div className="hidden lg:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Checkbox 
                              checked={selectedCalculations.length === filteredCalculations.length && filteredCalculations.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
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
                            <TableCell>
                              <Checkbox 
                                checked={selectedCalculations.includes(calculation.id)}
                                onCheckedChange={(checked) => handleSelect(calculation.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell className="text-sm">{format(new Date(calculation.createdAt), "MMM dd, yyyy")}</TableCell>
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
                                <Button size="sm" variant="outline" onClick={() => handleViewCalculation(calculation.id)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleToggleCalculation(calculation.id, calculation.isDeleted)}
                                  title="Move to trash"
                                >
                                  <Archive className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="lg:hidden space-y-4">
                    {filteredCalculations.map((calculation) => (
                      <Card key={calculation.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <Checkbox 
                                checked={selectedCalculations.includes(calculation.id)}
                                onCheckedChange={(checked) => handleSelect(calculation.id, checked as boolean)}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{calculation.companyName}</h3>
                                <p className="text-xs text-muted-foreground truncate">{calculation.scope}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewCalculation(calculation.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleToggleCalculation(calculation.id, calculation.isDeleted)}
                                title="Move to trash"
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Date:</span>
                              <p className="font-medium">{format(new Date(calculation.createdAt), "MMM dd, yyyy")}</p>
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
        </TabsContent>
        <TabsContent value="trash">
          <Card>
            <CardHeader>
              <CardTitle>Trash</CardTitle>
              <CardDescription>
                {filteredCalculations.length} of {calculations.filter(c => c.isDeleted).length} calculations
              </CardDescription>
              <div className="lg:hidden flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="selectAllTrashMobile"
                  checked={selectedCalculations.length === filteredCalculations.length && filteredCalculations.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="selectAllTrashMobile" className="text-sm font-medium">Select All</label>
              </div>
              {selectedCalculations.length > 0 && (
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => handleBulkAction("restore")} variant="outline" size="sm">
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    Restore ({selectedCalculations.length})
                  </Button>
                  <Button onClick={() => handleBulkAction("delete")} variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Permanently ({selectedCalculations.length})
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <RefreshCw className="mx-auto h-12 w-12 mb-4 animate-spin text-muted-foreground" />
                  <p>Loading calculations...</p>
                </div>
              ) : filteredCalculations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Trash2 className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>Trash is empty.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="hidden lg:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Checkbox 
                              checked={selectedCalculations.length === filteredCalculations.length && filteredCalculations.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Scope</TableHead>
                          <TableHead>Standard</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCalculations.map((calculation) => (
                          <TableRow key={calculation.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedCalculations.includes(calculation.id)}
                                onCheckedChange={(checked) => handleSelect(calculation.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell className="text-sm">{format(new Date(calculation.createdAt), "MMM dd, yyyy")}</TableCell>
                            <TableCell className="font-medium">{calculation.companyName}</TableCell>
                            <TableCell className="max-w-32 truncate" title={calculation.scope}>
                              {calculation.scope}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{calculation.standard}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">{calculation.result} days</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleToggleCalculation(calculation.id, calculation.isDeleted)}
                                  title="Restore from trash"
                                >
                                  <ArchiveRestore className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeletePermanently(calculation.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="lg:hidden space-y-4">
                    {filteredCalculations.map((calculation) => (
                      <Card key={calculation.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <Checkbox 
                                checked={selectedCalculations.includes(calculation.id)}
                                onCheckedChange={(checked) => handleSelect(calculation.id, checked as boolean)}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{calculation.companyName}</h3>
                                <p className="text-xs text-muted-foreground truncate">{calculation.scope}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleToggleCalculation(calculation.id, calculation.isDeleted)}
                                title="Restore from trash"
                              >
                                <ArchiveRestore className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeletePermanently(calculation.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
