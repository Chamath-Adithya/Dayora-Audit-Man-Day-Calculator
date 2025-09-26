"use client"

import { useState, useEffect, useCallback } from "react"
import { useConfig } from "./config-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, RotateCcw, AlertTriangle, Loader2, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"


interface EmployeeRange {
  min: number
  max: number
  adjustment: number
  description: string
  order: number
}

interface IntegratedStandard {
  id: string
  name: string
  reduction: number
  order: number
}

interface BaseManDays {
  [standard: string]: {
    [category: string]: number
  }
}

interface RiskMultiplier {
  id: string
  name: string
  multiplier: number
}

interface AdminConfig {
  employeeRanges: EmployeeRange[]
  baseManDays: BaseManDays
  riskLevels: RiskLevel[]
  haccpMultiplier: number
  multiSiteMultiplier: number
  integratedSystemReduction: number
  integratedStandards: IntegratedStandard[]
  categories: { name: string; order: number }[]
}

interface RiskLevel {
  id: string
  name: string
  multiplier: number
  description?: string
  order: number
}



export function AdminConfiguration() {
  const { config: initialConfig, isLoading, refetchConfig } = useConfig()
  const [config, setConfig] = useState<AdminConfig | null>(initialConfig)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTab, setSelectedTab] = useState("employee-ranges")

  useEffect(() => {
    setConfig(initialConfig)
    if (initialConfig) {
      setStandards(Object.keys(initialConfig.baseManDays))
      setCategories(initialConfig.categories)
    }
  }, [initialConfig])

  const handleSaveConfig = async () => {
    if (!config) return
    setIsSaving(true)
    const promise = fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })

    toast.promise(promise, {
      loading: "Saving configuration...",
      success: () => {
        setHasChanges(false)
        setIsSaving(false)
        return "Configuration saved successfully!"
      },
      error: () => {
        setIsSaving(false)
        return "Error saving configuration."
      },
    })
  }

  const handleResetToDefaults = async () => {
    if (confirm("Are you sure you want to reset all configuration to default values? This will immediately overwrite the current settings.")) {
        const promise = fetch("/api/config/reset", {
            method: "POST",
        }).then(res => {
            if (!res.ok) {
                throw new Error("Failed to reset configuration.");
            }
            return res.json();
        });

        toast.promise(promise, {
            loading: "Resetting configuration to defaults...",
            success: () => {
                refetchConfig();
                return "Configuration has been reset successfully.";
            },
            error: "Error resetting configuration.",
        });
    }
  }

  const updateEmployeeRange = (index: number, field: keyof EmployeeRange, value: number | string) => {
    if (!config) return
    const newRanges = [...config.employeeRanges]
    newRanges[index] = { ...newRanges[index], [field]: value }
    setConfig({ ...config, employeeRanges: newRanges })
    setHasChanges(true)
  }

  const addEmployeeRange = () => {
    if (!config) return
    const maxOrder = config.employeeRanges.length > 0 ? Math.max(...config.employeeRanges.map(r => r.order)) : 0
    const newRanges = [...config.employeeRanges, { min: 0, max: 0, adjustment: 0, description: "New Range", order: maxOrder + 1 }]
    setConfig({ ...config, employeeRanges: newRanges })
    setHasChanges(true)
  }

  const removeEmployeeRange = (index: number) => {
    if (!config) return
    const newRanges = config.employeeRanges.filter((_, i) => i !== index)
    setConfig({ ...config, employeeRanges: newRanges })
    setHasChanges(true)
  }

  const updateBaseManDays = (standard: string, category: string, value: number) => {
    if (!config) return
    const newBaseManDays = {
      ...config.baseManDays,
      [standard]: {
        ...config.baseManDays[standard],
        [category]: value,
      },
    }
    setConfig({ ...config, baseManDays: newBaseManDays })
    setHasChanges(true)
  }



  const updateGeneralSetting = (field: keyof AdminConfig, value: number) => {
    if (!config) return
    setConfig({ ...config, [field]: value })
    setHasChanges(true)
  }

  const updateIntegratedStandard = (index: number, field: keyof IntegratedStandard, value: string | number) => {
    if (!config) return
    const newStandards = [...config.integratedStandards]
    newStandards[index] = { ...newStandards[index], [field]: value }
    setConfig({ ...config, integratedStandards: newStandards })
    setHasChanges(true)
  }

  const addIntegratedStandard = () => {
    if (!config) return
    const maxOrder = config.integratedStandards.length > 0 ? Math.max(...config.integratedStandards.map(s => s.order)) : 0
    const newStandards = [...config.integratedStandards, { id: `NEW_${Date.now()}`, name: "New Standard", reduction: 0.1, order: maxOrder + 1 }]
    setConfig({ ...config, integratedStandards: newStandards })
    setHasChanges(true)
  }

  const removeIntegratedStandard = (index: number) => {
    if (!config) return
    const newStandards = config.integratedStandards.filter((_, i) => i !== index)
    setConfig({ ...config, integratedStandards: newStandards })
    setHasChanges(true)
  }

  const updateRiskLevel = (index: number, field: keyof RiskLevel, value: string | number) => {
    if (!config) return
    const newRiskLevels = [...config.riskLevels]
    newRiskLevels[index] = { ...newRiskLevels[index], [field]: value }
    setConfig({ ...config, riskLevels: newRiskLevels })
    setHasChanges(true)
  }

  const addRiskLevel = () => {
    if (!config) return
    const maxOrder = config.riskLevels.length > 0 ? Math.max(...config.riskLevels.map(r => r.order)) : 0
    const newRiskLevels = [...config.riskLevels, { id: `NEW_${Date.now()}`, name: "New Risk Level", multiplier: 1.0, order: maxOrder + 1 }]
    setConfig({ ...config, riskLevels: newRiskLevels })
    setHasChanges(true)
  }

  const removeRiskLevel = (index: number) => {
    if (!config) return
    const newRiskLevels = config.riskLevels.filter((_, i) => i !== index)
    setConfig({ ...config, riskLevels: newRiskLevels })
    setHasChanges(true)
  }

  const [categories, setCategories] = useState<{ name: string; order: number }[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [standards, setStandards] = useState<string[]>([])
  const [newStandardName, setNewStandardName] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [draggedTable, setDraggedTable] = useState<string | null>(null)

  const addStandard = () => {
    if (newStandardName && !standards.includes(newStandardName) && config) {
      const newStandards = [...standards, newStandardName]
      setStandards(newStandards)

      const newBaseManDays = { ...config.baseManDays, [newStandardName]: {} }
      setConfig({ ...config, baseManDays: newBaseManDays })
      setHasChanges(true)
      setNewStandardName("")
    }
  }

  const removeStandard = (standardToRemove: string) => {
    if (confirm(`Are you sure you want to remove the "${standardToRemove}" standard? All its data will be lost.`)) {
      const newStandards = standards.filter(s => s !== standardToRemove)
      setStandards(newStandards)

      if (config) {
        const newBaseManDays = { ...config.baseManDays }
        delete newBaseManDays[standardToRemove]
        setConfig({ ...config, baseManDays: newBaseManDays })
        setHasChanges(true)
      }
    }
  }

  const addCategory = () => {
    if (newCategoryName && !categories.some(c => c.name === newCategoryName) && config) {
      const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) : 0
      const newCategories = [...categories, { name: newCategoryName, order: maxOrder + 1 }]
      setCategories(newCategories)
      setConfig({ ...config, categories: newCategories })
      setHasChanges(true)
      setNewCategoryName("")
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    if (confirm(`Are you sure you want to remove the "${categoryToRemove}" category?`)) {
      const newCategories = categories.filter(c => c.name !== categoryToRemove)
      setCategories(newCategories)
      if (config) {
        setConfig({ ...config, categories: newCategories })
        setHasChanges(true)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number, table: string) => {
    setDraggedIndex(index)
    setDraggedTable(table)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, dropIndex: number, table: string) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex || draggedTable !== table) {
      setDraggedIndex(null)
      setDraggedTable(null)
      return
    }

    if (table === 'categories') {
      const sortedCategories = [...categories].sort((a, b) => a.order - b.order)
      const draggedCategory = sortedCategories[draggedIndex]
      const newCategories = [...sortedCategories]

      // Remove dragged item
      newCategories.splice(draggedIndex, 1)
      // Insert at new position
      newCategories.splice(dropIndex, 0, draggedCategory)

      // Update order values
      const reorderedCategories = newCategories.map((cat, index) => ({
        ...cat,
        order: index + 1
      }))

      setCategories(reorderedCategories)
      if (config) {
        setConfig({ ...config, categories: reorderedCategories })
        setHasChanges(true)
      }
    } else if (table === 'employeeRanges' && config) {
      const sortedRanges = [...config.employeeRanges].sort((a, b) => a.order - b.order)
      const draggedRange = sortedRanges[draggedIndex]
      const newRanges = [...sortedRanges]

      // Remove dragged item
      newRanges.splice(draggedIndex, 1)
      // Insert at new position
      newRanges.splice(dropIndex, 0, draggedRange)

      // Update order values
      const reorderedRanges = newRanges.map((range, index) => ({
        ...range,
        order: index + 1
      }))

      setConfig({ ...config, employeeRanges: reorderedRanges })
      setHasChanges(true)
    } else if (table === 'riskLevels' && config) {
      const sortedRiskLevels = [...config.riskLevels].sort((a, b) => a.order - b.order)
      const draggedRiskLevel = sortedRiskLevels[draggedIndex]
      const newRiskLevels = [...sortedRiskLevels]

      // Remove dragged item
      newRiskLevels.splice(draggedIndex, 1)
      // Insert at new position
      newRiskLevels.splice(dropIndex, 0, draggedRiskLevel)

      // Update order values
      const reorderedRiskLevels = newRiskLevels.map((risk, index) => ({
        ...risk,
        order: index + 1
      }))

      setConfig({ ...config, riskLevels: reorderedRiskLevels })
      setHasChanges(true)
    } else if (table === 'integratedStandards' && config) {
      const sortedStandards = [...config.integratedStandards].sort((a, b) => a.order - b.order)
      const draggedStandard = sortedStandards[draggedIndex]
      const newStandards = [...sortedStandards]

      // Remove dragged item
      newStandards.splice(draggedIndex, 1)
      // Insert at new position
      newStandards.splice(dropIndex, 0, draggedStandard)

      // Update order values
      const reorderedStandards = newStandards.map((standard, index) => ({
        ...standard,
        order: index + 1
      }))

      setConfig({ ...config, integratedStandards: reorderedStandards })
      setHasChanges(true)
    }

    setDraggedIndex(null)
    setDraggedTable(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDraggedTable(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-4 text-muted-foreground">Loading configuration...</p>
      </div>
    )
  }
  
  if (!config) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Could not load admin configuration. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Save Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Configuration Management</CardTitle>
              <CardDescription>Modify base values and parameters used in audit man-day calculations</CardDescription>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button onClick={handleResetToDefaults} variant="outline" size="sm" disabled={isSaving}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={handleSaveConfig} disabled={!hasChanges || isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </div>
          {hasChanges && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>You have unsaved changes. Remember to save your configuration.</AlertDescription>
            </Alert>
          )}
        </CardHeader>
      </Card>

      <Tabs defaultValue="employee-ranges" className="space-y-4" onValueChange={(value) => setSelectedTab(value)} value={selectedTab}>
        <div className="md:hidden">
          <Select onValueChange={(value) => setSelectedTab(value)} value={selectedTab}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee-ranges">Employee Ranges</SelectItem>
              <SelectItem value="base-days">Base Man-Days</SelectItem>
              <SelectItem value="multipliers">Risk & Multipliers</SelectItem>
              <SelectItem value="general">General Settings</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TabsList className="hidden md:grid grid-cols-4">
          <TabsTrigger value="employee-ranges">Employee Ranges</TabsTrigger>
          <TabsTrigger value="base-days">Base Man-Days</TabsTrigger>
          <TabsTrigger value="multipliers">Risk & Multipliers</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        {/* Employee Ranges Tab */}
        <TabsContent value="employee-ranges">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Employee Range Adjustments
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  System Ordered
                </span>
              </CardTitle>
              <CardDescription>
                Configure the additional man-days based on organization size (number of employees).
                <span className="block text-green-600 mt-1 font-medium">
                  ✅ Drag and drop rows to reorder employee ranges. Order is saved to database.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Min Employees</TableHead>
                      <TableHead>Max Employees</TableHead>
                      <TableHead>Additional Man-Days</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.employeeRanges
                      .sort((a, b) => a.order - b.order)
                      .map((range, index) => (
                      <TableRow
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index, 'employeeRanges')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index, 'employeeRanges')}
                        onDragEnd={handleDragEnd}
                        className={draggedIndex === index ? 'opacity-50' : ''}
                      >
                        <TableCell className="font-medium relative group">
                          <div className="flex items-center gap-2">
                            <div className="cursor-move text-gray-400 hover:text-gray-600">
                              ⋮⋮
                            </div>
                            <Input
                              type="number"
                              value={range.min}
                              onChange={(e) => updateEmployeeRange(index, "min", Number.parseInt(e.target.value))}
                              className="w-20"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={range.max === 999999 ? "" : range.max}
                            placeholder="∞"
                            onChange={(e) =>
                              updateEmployeeRange(
                                index,
                                "max",
                                e.target.value ? Number.parseInt(e.target.value) : 999999,
                              )
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.1"
                            value={range.adjustment}
                            onChange={(e) =>
                              updateEmployeeRange(index, "adjustment", Number.parseFloat(e.target.value))
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={range.description}
                            onChange={(e) => updateEmployeeRange(index, "description", e.target.value)}
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => removeEmployeeRange(index)}>
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button onClick={addEmployeeRange} className="mt-4">
                  Add Employee Range
                </Button>
              </div>
              <div className="md:hidden space-y-4">
                {config.employeeRanges.map((range, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Min Employees</Label>
                        <Input
                          type="number"
                          value={range.min}
                          onChange={(e) => updateEmployeeRange(index, "min", Number.parseInt(e.target.value))}
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Max Employees</Label>
                        <Input
                          type="number"
                          value={range.max === 999999 ? "" : range.max}
                          placeholder="∞"
                          onChange={(e) =>
                            updateEmployeeRange(
                              index,
                              "max",
                              e.target.value ? Number.parseInt(e.target.value) : 999999,
                            )
                          }
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Additional Man-Days</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={range.adjustment}
                          onChange={(e) =>
                            updateEmployeeRange(index, "adjustment", Number.parseFloat(e.target.value))
                          }
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Description</Label>
                        <Input
                          value={range.description}
                          onChange={(e) => updateEmployeeRange(index, "description", e.target.value)}
                          className="w-40"
                        />
                      </div>
                      <div className="pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => removeEmployeeRange(index)}
                        >
                          Remove Range
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button onClick={addEmployeeRange} className="mt-4 w-full">
                  Add Employee Range
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Base Man-Days Tab */}
        <TabsContent value="base-days">
          <Card>
            <CardHeader>
              <CardTitle>Base Man-Days by Standard and Category</CardTitle>
              <CardDescription>
                Configure the base audit man-days for each management system standard and category combination.
                <span className="block text-green-600 mt-1 font-medium">
                  ✅ Drag and drop rows to reorder categories. Order is saved to database.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Input
                  placeholder="New Standard Name"
                  value={newStandardName}
                  onChange={(e) => setNewStandardName(e.target.value.toUpperCase())}
                />
                <Button onClick={addStandard}>Add Standard</Button>
              </div>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      {standards.map((standard) => (
                        <TableHead key={standard} className="relative group">
                          {standard}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                            onClick={() => removeStandard(standard)}
                          >
                            &times;
                          </Button>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories
                      .sort((a, b) => a.order - b.order)
                      .map((category, index) => (
                      <TableRow
                        key={category.name}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index, 'categories')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index, 'categories')}
                        onDragEnd={handleDragEnd}
                        className={draggedIndex === index ? 'opacity-50' : ''}
                      >
                        <TableCell className="font-medium relative group">
                          <div className="flex items-center gap-2">
                            <div className="cursor-move text-gray-400 hover:text-gray-600">
                              ⋮⋮
                            </div>
                            <Badge variant="outline">{category.name}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                            onClick={() => removeCategory(category.name)}
                          >
                            &times;
                          </Button>
                        </TableCell>
                        {standards.map((standard) => (
                          <TableCell key={`${standard}-${category.name}`}>
                            <Input
                              type="number"
                              value={config.baseManDays[standard]?.[category.name] || 0}
                              onChange={(e) =>
                                updateBaseManDays(standard, category.name, Number.parseInt(e.target.value) || 0)
                              }
                              className="w-16"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex gap-2">
                  <Input
                    placeholder="New Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value.toUpperCase())}
                  />
                  <Button onClick={addCategory}>Add Category</Button>
                </div>
              </div>
              <div className="md:hidden space-y-4">
                {standards.map((standard) => (
                  <Card key={standard} className="p-4">
                    <CardTitle className="text-lg mb-2">{standard}</CardTitle>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <Label>{category.name}</Label>
                          <Input
                            type="number"
                            value={config.baseManDays[standard]?.[category.name] || 0}
                            onChange={(e) =>
                              updateBaseManDays(standard, category.name, Number.parseInt(e.target.value) || 0)
                            }
                            className="w-24"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk & Multipliers Tab */}
        <TabsContent value="multipliers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Risk Level Management
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    System Ordered
                  </span>
                </CardTitle>
              <CardDescription>
                Add, remove, and configure risk levels and their multipliers.
                <span className="block text-green-600 mt-1 font-medium">
                  ✅ Drag and drop rows to reorder risk levels. Order is saved to database.
                </span>
              </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Risk Level ID</TableHead>
                          <TableHead>Risk Level Name</TableHead>
                          <TableHead>Multiplier</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {config.riskLevels
                          .sort((a, b) => a.order - b.order)
                          .map((risk, index) => (
                          <TableRow
                            key={risk.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index, 'riskLevels')}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index, 'riskLevels')}
                            onDragEnd={handleDragEnd}
                            className={draggedIndex === index ? 'opacity-50' : ''}
                          >
                            <TableCell className="font-medium relative group">
                              <div className="flex items-center gap-2">
                                <div className="cursor-move text-gray-400 hover:text-gray-600">
                                  ⋮⋮
                                </div>
                                <Input
                                  value={risk.id}
                                  onChange={(e) => updateRiskLevel(index, "id", e.target.value)}
                                  placeholder="e.g., low"
                                  className="w-20"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={risk.name}
                                onChange={(e) => updateRiskLevel(index, "name", e.target.value)}
                                placeholder="e.g., Low Risk"
                                className="w-32"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={risk.multiplier}
                                onChange={(e) =>
                                  updateRiskLevel(index, "multiplier", Number.parseFloat(e.target.value))
                                }
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={risk.description || ""}
                                onChange={(e) => updateRiskLevel(index, "description", e.target.value)}
                                placeholder="Optional description"
                                className="w-40"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="destructive" size="sm" onClick={() => removeRiskLevel(index)}>
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Button onClick={addRiskLevel} className="mt-4">
                      Add Risk Level
                    </Button>
                  </div>
                  <div className="md:hidden space-y-4">
                    {config.riskLevels.map((risk, index) => (
                      <Card key={risk.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Risk Level ID</Label>
                            <Input
                              value={risk.id}
                              onChange={(e) => updateRiskLevel(index, "id", e.target.value)}
                              placeholder="e.g., low"
                              className="w-24"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Risk Level Name</Label>
                            <Input
                              value={risk.name}
                              onChange={(e) => updateRiskLevel(index, "name", e.target.value)}
                              placeholder="e.g., Low Risk"
                              className="w-32"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Multiplier</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={risk.multiplier}
                              onChange={(e) =>
                                updateRiskLevel(index, "multiplier", Number.parseFloat(e.target.value))
                              }
                              className="w-24"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Description</Label>
                            <Input
                              value={risk.description || ""}
                              onChange={(e) => updateRiskLevel(index, "description", e.target.value)}
                              placeholder="Optional description"
                              className="w-40"
                            />
                          </div>
                          <div className="pt-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={() => removeRiskLevel(index)}
                            >
                              Remove Risk Level
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button onClick={addRiskLevel} className="mt-4 w-full">
                      Add Risk Level
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HACCP Study Multiplier</CardTitle>
                <CardDescription>Additional man-days per HACCP study (FSMS only)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="haccp-multiplier">Man-Days per HACCP Study</Label>
                  <Input
                    id="haccp-multiplier"
                    type="number"
                    step="0.1"
                    value={config.haccpMultiplier}
                    onChange={(e) => updateGeneralSetting("haccpMultiplier", Number.parseFloat(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Integrated Standards Management
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    System Ordered
                  </span>
                </CardTitle>
              <CardDescription>
                Manage the list of standards that can be integrated and their man-day reduction percentages.
                <span className="block text-green-600 mt-1 font-medium">
                  ✅ Drag and drop rows to reorder integrated standards. Order is saved to database.
                </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Standard ID</TableHead>
                        <TableHead>Standard Name</TableHead>
                        <TableHead>Reduction (0.1 = 10%)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {config.integratedStandards
                        .sort((a, b) => a.order - b.order)
                        .map((standard, index) => (
                        <TableRow
                          key={standard.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index, 'integratedStandards')}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index, 'integratedStandards')}
                          onDragEnd={handleDragEnd}
                          className={draggedIndex === index ? 'opacity-50' : ''}
                        >
                          <TableCell className="font-medium relative group">
                            <div className="flex items-center gap-2">
                              <div className="cursor-move text-gray-400 hover:text-gray-600">
                                ⋮⋮
                              </div>
                              <Input
                                value={standard.id}
                                onChange={(e) => updateIntegratedStandard(index, "id", e.target.value)}
                                placeholder="e.g., ISO_14001"
                                className="w-32"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={standard.name}
                              onChange={(e) => updateIntegratedStandard(index, "name", e.target.value)}
                              placeholder="e.g., ISO 14001"
                              className="w-40"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={standard.reduction}
                              onChange={(e) =>
                                updateIntegratedStandard(index, "reduction", Number.parseFloat(e.target.value))
                              }
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="sm" onClick={() => removeIntegratedStandard(index)}>
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button onClick={addIntegratedStandard} className="mt-4">
                    Add Standard
                  </Button>
                </div>
                <div className="md:hidden space-y-4">
                  {config.integratedStandards.map((standard, index) => (
                    <Card key={standard.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Standard ID</Label>
                          <Input
                            value={standard.id}
                            onChange={(e) => updateIntegratedStandard(index, "id", e.target.value)}
                            placeholder="e.g., ISO_14001"
                            className="w-32"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Standard Name</Label>
                          <Input
                            value={standard.name}
                            onChange={(e) => updateIntegratedStandard(index, "name", e.target.value)}
                            placeholder="e.g., ISO 14001"
                            className="w-40"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Reduction (0.1 = 10%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={standard.reduction}
                            onChange={(e) =>
                              updateIntegratedStandard(index, "reduction", Number.parseFloat(e.target.value))
                            }
                            className="w-24"
                          />
                        </div>
                        <div className="pt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => removeIntegratedStandard(index)}
                          >
                            Remove Standard
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addIntegratedStandard} className="mt-4 w-full">
                    Add Standard
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Multi-Site Adjustment</CardTitle>
                  <CardDescription>Additional man-days per additional site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="multisite-multiplier">Man-Days per Additional Site</Label>
                    <Input
                      id="multisite-multiplier"
                      type="number"
                      step="0.1"
                      value={config.multiSiteMultiplier}
                      onChange={(e) => updateGeneralSetting("multiSiteMultiplier", Number.parseFloat(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Default Integrated System Reduction</CardTitle>
                  <CardDescription>
                    Fallback percentage reduction if a specific standard reduction is not defined.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="integrated-reduction">Default Reduction (0.1 = 10%)</Label>
                    <Input
                      id="integrated-reduction"
                      type="number"
                      step="0.01"
                      value={config.integratedSystemReduction}
                      onChange={(e) =>
                        updateGeneralSetting("integratedSystemReduction", Number.parseFloat(e.target.value))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>


      </Tabs>
    </div>
  )
}
