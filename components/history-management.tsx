"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Trash2, Eye, Download, Calendar, RefreshCw, FileText, BarChart2, ToggleLeft, ToggleRight, AlertTriangle, Archive, ArchiveRestore, ArrowUpDown, ArrowUp, ArrowDown, Filter, Grid3X3, List, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { apiClient, type SavedCalculation } from "@/lib/api-client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KPICardsSkeleton, ChartSkeleton, TableSkeleton, TabsSkeleton, SearchFiltersSkeleton } from "@/components/ui/skeleton"

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
  const [sortField, setSortField] = useState<keyof SavedCalculation>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [groupBy, setGroupBy] = useState<string>("none")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [groupedData, setGroupedData] = useState<{[key: string]: SavedCalculation[]}>({})
  const [visualizationTab, setVisualizationTab] = useState<string>("overview")

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

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle different data types
      if (sortField === 'createdAt') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setFilteredCalculations(filtered)
  }, [calculations, searchTerm, standardFilter, auditTypeFilter, view, sortField, sortDirection])

  // Group data based on groupBy selection
  useEffect(() => {
    if (groupBy === 'none') {
      setGroupedData({})
      return
    }

    const grouped: {[key: string]: SavedCalculation[]} = {}

    filteredCalculations.forEach(calc => {
      let groupKey = ''
      switch (groupBy) {
        case 'standard':
          groupKey = calc.standard
          break
        case 'auditType':
          groupKey = calc.auditType
          break
        case 'riskLevel':
          groupKey = calc.riskLevel
          break
        case 'companyName':
          groupKey = calc.companyName
          break
        case 'createdAt':
          // Group by date (YYYY-MM-DD format)
          groupKey = format(new Date(calc.createdAt), 'MMM dd, yyyy')
          break
        default:
          groupKey = 'Other'
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = []
      }
      grouped[groupKey].push(calc)
    })

    // Sort groups alphabetically
    const sortedGrouped: {[key: string]: SavedCalculation[]} = {}
    Object.keys(grouped).sort().forEach(key => {
      sortedGrouped[key] = grouped[key]
    })

    setGroupedData(sortedGrouped)
  }, [filteredCalculations, groupBy])

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

  const handleExportHistoryPDF = async () => {
    if (selectedCalculations.length === 0) {
      alert("Please select calculations before exporting.")
      return
    }

    const calculationsToExport = calculations.filter(calc =>
      selectedCalculations.includes(calc.id)
    )

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
      window.URL.revokeObjectURL(url);
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

  // Data for pie chart - calculations by standard
  const standardData = Object.entries(
    calculations.filter(c => !c.isDeleted).reduce((acc, calc) => {
      acc[calc.standard] = (acc[calc.standard] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([standard, count]) => ({ name: standard, value: count }));

  // Data for line chart - calculations over time
  const timeData = Object.entries(
    calculations.filter(c => !c.isDeleted).reduce((acc, calc) => {
      const date = format(new Date(calc.createdAt), 'MMM yyyy');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
  .map(([date, count]) => ({ date, calculations: count }))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // KPI data
  const totalCalculations = calculations.length;
  const activeCalculations = calculations.filter(c => !c.isDeleted).length;
  const trashCalculations = calculations.filter(c => c.isDeleted).length;
  const highRiskCount = calculations.filter(c => c.riskLevel === 'high').length;
  const mediumRiskCount = calculations.filter(c => c.riskLevel === 'medium').length;
  const lowRiskCount = calculations.filter(c => c.riskLevel === 'low').length;

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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

  const handleSort = (field: keyof SavedCalculation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: keyof SavedCalculation) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {error ? (
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
        ) : (
          <>
            {/* KPI Cards Skeleton */}
            <KPICardsSkeleton count={6} />

            {/* Visualization Tabs Skeleton */}
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-96"></div>
              </CardHeader>
              <CardContent>
                <TabsSkeleton />
              </CardContent>
            </Card>

            {/* Search and Filters Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 mt-2"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </CardHeader>
              <CardContent>
                <SearchFiltersSkeleton />
              </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-40"></div>
                    <div className="h-4 bg-gray-200 rounded w-64 mt-2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TableSkeleton rows={8} columns={10} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    )
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{totalCalculations}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeCalculations}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trash</p>
                <p className="text-2xl font-bold text-red-600">{trashCalculations}</p>
              </div>
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-red-500">{highRiskCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
                <p className="text-2xl font-bold text-yellow-500">{mediumRiskCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Risk</p>
                <p className="text-2xl font-bold text-green-500">{lowRiskCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>History Overview</CardTitle>
          <CardDescription>A visual summary of your calculation history with multiple perspectives.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={visualizationTab} onValueChange={setVisualizationTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="standards">By Standard</TabsTrigger>
              <TabsTrigger value="timeline">Over Time</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Company vs. Man-Days</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          color: 'hsl(var(--card-foreground))',
                          fontSize: '14px'
                        }}
                        labelStyle={{ color: 'hsl(var(--card-foreground))', fontWeight: 'bold' }}
                        itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '14px' }} />
                      <Bar dataKey="manDays" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Standards Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={standardData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {standardData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="standards" className="mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Standards Distribution (Donut Chart)</h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={standardData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {standardData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Standards Summary</h4>
                  <div className="space-y-3">
                    {standardData.map((standard, index) => (
                      <div key={standard.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{standard.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{standard.value}</div>
                          <div className="text-sm text-muted-foreground">
                            {((standard.value / standardData.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Calculations Over Time</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          color: 'hsl(var(--card-foreground))',
                          fontSize: '14px'
                        }}
                        labelStyle={{ color: 'hsl(var(--card-foreground))', fontWeight: 'bold' }}
                        itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                      />
                      <Area type="monotone" dataKey="calculations" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Timeline Summary</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {timeData.map((period, index) => (
                      <div key={period.date} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">{index + 1}</span>
                          </div>
                          <span className="font-medium">{period.date}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{period.calculations}</div>
                          <div className="text-sm text-muted-foreground">calculations</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-shrink-0"
                    >
                      {viewMode === 'table' ? <Grid3X3 className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
                      {viewMode === 'table' ? 'Grid' : 'Table'}
                    </Button>
                    <Select value={groupBy} onValueChange={setGroupBy}>
                      <SelectTrigger className="w-full md:w-auto">
                        <SelectValue placeholder="Group by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Grouping</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="auditType">Audit Type</SelectItem>
                        <SelectItem value="riskLevel">Risk Level</SelectItem>
                        <SelectItem value="companyName">Company</SelectItem>
                        <SelectItem value="createdAt">Date</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => handleExportHistoryPDF()} variant="outline" size="sm" className="flex-shrink-0">
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Export PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </Button>
                  </div>
                  {selectedCalculations.length > 0 && (
                    <Button onClick={() => handleBulkAction("archive")} variant="outline" size="sm" className="flex-shrink-0">
                      <Archive className="mr-2 h-4 w-4" />
                      Move to Trash ({selectedCalculations.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calculation History</CardTitle>
                  <CardDescription>
                    {filteredCalculations.length} of {calculations.filter(c => !c.isDeleted).length} calculations
                    {groupBy !== 'none' && (
                      <span className="ml-2 text-primary font-medium">
                        • Grouped by {groupBy === 'standard' ? 'Standard' :
                                      groupBy === 'auditType' ? 'Audit Type' :
                                      groupBy === 'riskLevel' ? 'Risk Level' :
                                      groupBy === 'companyName' ? 'Company' : groupBy}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {groupBy !== 'none' && (
                    <Button
                      onClick={() => setGroupBy('none')}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      No Grouping
                    </Button>
                  )}
                  <div className="lg:hidden flex items-center space-x-2">
                    <Checkbox
                      id="selectAllMobile"
                      checked={selectedCalculations.length === filteredCalculations.length && filteredCalculations.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="selectAllMobile" className="text-sm font-medium">Select All</label>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCalculations.length === 0 ? (
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
              ) : viewMode === 'table' ? (
                // Table view
                <div className="overflow-x-auto">
                  {groupBy === 'none' ? (
                    // Flat table view (no grouping)
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
                            <TableHead>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                onClick={() => handleSort('createdAt')}
                              >
                                Date
                                {getSortIcon('createdAt')}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                onClick={() => handleSort('companyName')}
                              >
                                Company
                                {getSortIcon('companyName')}
                              </Button>
                            </TableHead>
                            <TableHead>Scope</TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                onClick={() => handleSort('standard')}
                              >
                                Standard
                                {getSortIcon('standard')}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                onClick={() => handleSort('auditType')}
                              >
                                Audit Type
                                {getSortIcon('auditType')}
                              </Button>
                            </TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                onClick={() => handleSort('employees')}
                              >
                                Employees
                                {getSortIcon('employees')}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                onClick={() => handleSort('riskLevel')}
                              >
                                Risk
                                {getSortIcon('riskLevel')}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                onClick={() => handleSort('result')}
                              >
                                Result
                                {getSortIcon('result')}
                              </Button>
                            </TableHead>
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
                  ) : (
                    // Grouped table view
                    <div className="space-y-6">
                      {Object.entries(groupedData).map(([groupName, groupItems]) => (
                        <Card key={groupName} className="overflow-hidden">
                          <CardHeader className="bg-muted/50 pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-primary"></div>
                                <div>
                                  <CardTitle className="text-lg">
                                    {groupName}
                                  </CardTitle>
                                  <CardDescription>
                                    {groupItems.length} calculation{groupItems.length !== 1 ? 's' : ''}
                                  </CardDescription>
                                </div>
                              </div>
                              <Checkbox
                                checked={groupItems.every(item => selectedCalculations.includes(item.id))}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCalculations(prev => [...prev, ...groupItems.map(item => item.id)])
                                  } else {
                                    setSelectedCalculations(prev => prev.filter(id => !groupItems.some(item => item.id === id)))
                                  }
                                }}
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-12"></TableHead>
                                    <TableHead>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                        onClick={() => handleSort('createdAt')}
                                      >
                                        Date
                                        {getSortIcon('createdAt')}
                                      </Button>
                                    </TableHead>
                                    <TableHead>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                        onClick={() => handleSort('companyName')}
                                      >
                                        Company
                                        {getSortIcon('companyName')}
                                      </Button>
                                    </TableHead>
                                    <TableHead>Scope</TableHead>
                                    <TableHead>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                        onClick={() => handleSort('standard')}
                                      >
                                        Standard
                                        {getSortIcon('standard')}
                                      </Button>
                                    </TableHead>
                                    <TableHead>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                        onClick={() => handleSort('auditType')}
                                      >
                                        Audit Type
                                        {getSortIcon('auditType')}
                                      </Button>
                                    </TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                        onClick={() => handleSort('employees')}
                                      >
                                        Employees
                                        {getSortIcon('employees')}
                                      </Button>
                                    </TableHead>
                                    <TableHead>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                        onClick={() => handleSort('riskLevel')}
                                      >
                                        Risk
                                        {getSortIcon('riskLevel')}
                                      </Button>
                                    </TableHead>
                                    <TableHead>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                        onClick={() => handleSort('result')}
                                      >
                                        Result
                                        {getSortIcon('result')}
                                      </Button>
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {groupItems.map((calculation) => (
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Mobile table view */}
                  <div className="lg:hidden space-y-4">
                    {groupBy === 'none' ? (
                      // Flat mobile view
                      filteredCalculations.map((calculation) => (
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
                      ))
                    ) : (
                      // Grouped mobile view
                      Object.entries(groupedData).map(([groupName, groupItems]) => (
                        <Card key={groupName} className="overflow-hidden">
                          <CardHeader className="bg-muted/50 pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-primary"></div>
                                <div>
                                  <CardTitle className="text-lg">
                                    {groupName}
                                  </CardTitle>
                                  <CardDescription>
                                    {groupItems.length} calculation{groupItems.length !== 1 ? 's' : ''}
                                  </CardDescription>
                                </div>
                              </div>
                              <Checkbox
                                checked={groupItems.every(item => selectedCalculations.includes(item.id))}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCalculations(prev => [...prev, ...groupItems.map(item => item.id)])
                                  } else {
                                    setSelectedCalculations(prev => prev.filter(id => !groupItems.some(item => item.id === id)))
                                  }
                                }}
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {groupItems.map((calculation) => (
                                <Card key={calculation.id} className="p-3 border-l-4 border-l-primary">
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-3">
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
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                // Grid view
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupBy === 'none' ? (
                    // Flat grid view
                    filteredCalculations.map((calculation) => (
                      <Card key={calculation.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={selectedCalculations.includes(calculation.id)}
                                onCheckedChange={(checked) => handleSelect(calculation.id, checked as boolean)}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">{calculation.companyName}</h3>
                                <p className="text-xs text-muted-foreground truncate">{calculation.scope}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button size="sm" variant="ghost" onClick={() => handleViewCalculation(calculation.id)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggleCalculation(calculation.id, calculation.isDeleted)}
                                title="Move to trash"
                              >
                                <Archive className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date:</span>
                              <span className="font-medium">{format(new Date(calculation.createdAt), "MMM dd, yyyy")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Result:</span>
                              <span className="font-semibold text-primary">{calculation.result} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Standard:</span>
                              <Badge variant="outline" className="text-xs">{calculation.standard}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Risk:</span>
                              <Badge variant={getRiskBadgeVariant(calculation.riskLevel)} className="text-xs">
                                {calculation.riskLevel}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="capitalize text-xs">{calculation.auditType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Category:</span>
                              <span className="text-xs">{calculation.category}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    // Grouped grid view
                    Object.entries(groupedData).map(([groupName, groupItems]) => (
                      <div key={groupName} className="space-y-3">
                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <h4 className="font-semibold text-sm">{groupName}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {groupItems.length}
                          </Badge>
                          <Checkbox
                            checked={groupItems.every(item => selectedCalculations.includes(item.id))}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCalculations(prev => [...prev, ...groupItems.map(item => item.id)])
                              } else {
                                setSelectedCalculations(prev => prev.filter(id => !groupItems.some(item => item.id === id)))
                              }
                            }}
                            className="ml-auto"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {groupItems.map((calculation) => (
                            <Card key={calculation.id} className="p-3 border-l-4 border-l-primary">
                              <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={selectedCalculations.includes(calculation.id)}
                                      onCheckedChange={(checked) => handleSelect(calculation.id, checked as boolean)}
                                      className="mt-0.5"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium text-xs truncate">{calculation.companyName}</h3>
                                      <p className="text-xs text-muted-foreground truncate">{calculation.scope}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="ghost" onClick={() => handleViewCalculation(calculation.id)}>
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleToggleCalculation(calculation.id, calculation.isDeleted)}
                                      title="Move to trash"
                                    >
                                      <Archive className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-1 text-xs">
                                  <div>
                                    <span className="text-muted-foreground">Date:</span>
                                    <p className="font-medium">{format(new Date(calculation.createdAt), "MMM dd")}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Result:</span>
                                    <p className="font-semibold text-primary">{calculation.result}d</p>
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
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
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
                          <TableHead>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 font-semibold hover:bg-transparent"
                              onClick={() => handleSort('createdAt')}
                            >
                              Date
                              {getSortIcon('createdAt')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 font-semibold hover:bg-transparent"
                              onClick={() => handleSort('companyName')}
                            >
                              Company
                              {getSortIcon('companyName')}
                            </Button>
                          </TableHead>
                          <TableHead>Scope</TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 font-semibold hover:bg-transparent"
                              onClick={() => handleSort('standard')}
                            >
                              Standard
                              {getSortIcon('standard')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 font-semibold hover:bg-transparent"
                              onClick={() => handleSort('result')}
                            >
                              Result
                              {getSortIcon('result')}
                            </Button>
                          </TableHead>
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
