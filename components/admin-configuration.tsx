"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, RotateCcw, AlertTriangle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

interface EmployeeRange {
  min: number
  max: number
  adjustment: number
  description: string
}

interface IntegratedStandard {
  id: string
  name: string
  reduction: number
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
  riskMultipliers: { low: number; medium: number; high: number }
  haccpMultiplier: number
  multiSiteMultiplier: number
  integratedSystemReduction: number
  integratedStandards: IntegratedStandard[]
  categories: string[]
}



export function AdminConfiguration() {
  const [config, setConfig] = useState<AdminConfig | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("employee-ranges")

  const fetchConfig = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/config")
      if (response.ok) {
        const data = await response.json()
        const validatedData = {
          ...data,
          riskMultipliers: data.riskMultipliers || { low: 1.0, medium: 1.0, high: 1.0 },
        }
        setConfig(validatedData)
        if (validatedData.baseManDays) {
          setStandards(Object.keys(validatedData.baseManDays))
        }
        if (validatedData.categories && validatedData.categories.length > 0) {
          setCategories(validatedData.categories)
        }
      } else {
        throw new Error("Failed to fetch config")
      }
    } catch (error) {
      console.error("Error loading admin config:", error)
      toast.error("Failed to load configuration. Please try again later.")
      setConfig(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

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
                fetchConfig(); // Refetch the configuration
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
    const newRanges = [...config.employeeRanges, { min: 0, max: 0, adjustment: 0, description: "New Range" }]
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

  const updateRiskMultiplier = (index: number, field: keyof RiskMultiplier, value: string | number) => {
    if (!config) return
    const newMultipliers = [...config.riskMultipliers]
    newMultipliers[index] = { ...newMultipliers[index], [field]: value }
    setConfig({ ...config, riskMultipliers: newMultipliers })
    setHasChanges(true)
  }

  const addRiskMultiplier = () => {
    if (!config) return
    const newMultipliers = [...config.riskMultipliers, { id: `NEW_${Date.now()}`, name: "New Risk", multiplier: 1.0 }]
    setConfig({ ...config, riskMultipliers: newMultipliers })
    setHasChanges(true)
  }

  const removeRiskMultiplier = (index: number) => {
    if (!config) return
    const newMultipliers = config.riskMultipliers.filter((_, i) => i !== index)
    setConfig({ ...config, riskMultipliers: newMultipliers })
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
    const newStandards = [...config.integratedStandards, { id: `NEW_${Date.now()}`, name: "New Standard", reduction: 0.1 }]
    setConfig({ ...config, integratedStandards: newStandards })
    setHasChanges(true)
  }

  const removeIntegratedStandard = (index: number) => {
    if (!config) return
    const newStandards = config.integratedStandards.filter((_, i) => i !== index)
    setConfig({ ...config, integratedStandards: newStandards })
    setHasChanges(true)
  }

  const [categories, setCategories] = useState(["AI", "AII", "BI", "BII", "BIII", "C", "D", "E", "F", "G", "H", "I", "J", "K"])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [standards, setStandards] = useState(["QMS", "EMS", "EnMS", "FSMS", "Cosmetics", "OHMS", "ISMS"])
  const [newStandardName, setNewStandardName] = useState("")

  // Default configuration for when database is empty
  const defaultConfig: AdminConfig = {
    employeeRanges: [
      { min: 1, max: 5, adjustment: 0, description: "1-5 employees" },
      { min: 6, max: 25, adjustment: 0.5, description: "6-25 employees" },
      { min: 26, max: 45, adjustment: 1, description: "26-45 employees" },
      { min: 46, max: 65, adjustment: 1.5, description: "46-65 employees" },
      { min: 66, max: 85, adjustment: 2, description: "66-85 employees" },
      { min: 86, max: 125, adjustment: 2.5, description: "86-125 employees" },
      { min: 126, max: 175, adjustment: 3, description: "126-175 employees" },
      { min: 176, max: 275, adjustment: 4, description: "176-275 employees" },
      { min: 276, max: 425, adjustment: 5, description: "276-425 employees" },
      { min: 426, max: 625, adjustment: 6, description: "426-625 employees" },
      { min: 626, max: 875, adjustment: 7, description: "626-875 employees" },
      { min: 876, max: 1175, adjustment: 8, description: "876-1175 employees" },
      { min: 1176, max: 999999, adjustment: 10, description: "1176+ employees" },
    ],
    baseManDays: {
      QMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
      EMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
      EnMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
      FSMS: { AI: 4, AII: 5, BI: 6, BII: 7, BIII: 8, C: 10, D: 12, E: 15, F: 18, G: 22, H: 27, I: 32, J: 38, K: 45 },
      Cosmetics: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
      OHMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
      ISMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
    },
    riskMultipliers: { low: 0.8, medium: 1.0, high: 1.2 },
    haccpMultiplier: 0.5,
    multiSiteMultiplier: 0.5,
    integratedSystemReduction: 0.1,
    integratedStandards: [
      { "id": "ISO_14001", "name": "ISO 14001 (EMS)", "reduction": 0.12 },
      { "id": "ISO_45001", "name": "ISO 45001 (OH&S)", "reduction": 0.12 },
      { "id": "ISO_22000", "name": "ISO 22000 (FSMS)", "reduction": 0.15 },
      { "id": "ISO_27001", "name": "ISO 27001 (ISMS)", "reduction": 0.10 },
      { "id": "ISO_50001", "name": "ISO 50001 (EnMS)", "reduction": 0.08 },
      { "id": "ISO_9001", "name": "ISO 9001 (QMS)", "reduction": 0.05 },
      { "id": "HACCP", "name": "HACCP/GMP", "reduction": 0.08 },
      { "id": "BRC", "name": "BRC Global Standard", "reduction": 0.10 },
      { "id": "FSSC_22000", "name": "FSSC 22000", "reduction": 0.12 }
    ],
  }

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
    if (newCategoryName && !categories.includes(newCategoryName) && config) {
      const newCategories = [...categories, newCategoryName]
      setCategories(newCategories)
      setConfig({ ...config, categories: newCategories })
      setHasChanges(true)
      setNewCategoryName("")
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    if (confirm(`Are you sure you want to remove the "${categoryToRemove}" category?`)) {
      const newCategories = categories.filter(c => c !== categoryToRemove)
      setCategories(newCategories)
      if (config) {
        setConfig({ ...config, categories: newCategories })
        setHasChanges(true)
      }
    }
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
              <CardTitle>Employee Range Adjustments</CardTitle>
              <CardDescription>
                Configure the additional man-days based on organization size (number of employees)
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
                    {config.employeeRanges.map((range, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            type="number"
                            value={range.min}
                            onChange={(e) => updateEmployeeRange(index, "min", Number.parseInt(e.target.value))}
                            className="w-20"
                          />
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
                Configure the base audit man-days for each management system standard and category combination
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
                    {categories.map((category, index) => (
                      <TableRow key={category}>
                        <TableCell className="font-medium relative group">
                          <Badge variant="outline">{category}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                            onClick={() => removeCategory(category)}
                          >
                            &times;
                          </Button>
                        </TableCell>
                        {standards.map((standard) => (
                          <TableCell key={`${standard}-${category}`}>
                            <Input
                              type="number"
                              value={config.baseManDays[standard]?.[category] || 0}
                              onChange={(e) =>
                                updateBaseManDays(standard, category, Number.parseInt(e.target.value) || 0)
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
                        <div key={category} className="flex items-center justify-between">
                          <Label>{category}</Label>
                          <Input
                            type="number"
                            value={config.baseManDays[standard]?.[category] || 0}
                            onChange={(e) =>
                              updateBaseManDays(standard, category, Number.parseInt(e.target.value) || 0)
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
                <CardTitle>Risk Level Multipliers</CardTitle>
                <CardDescription>Adjust the multipliers applied based on risk/complexity assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="risk-low">Low Risk Multiplier</Label>
                      <Input
                        id="risk-low"
                        type="number"
                        step="0.01"
                        value={config.riskMultipliers.low}
                        onChange={(e) => setConfig({
                          ...config,
                          riskMultipliers: { ...config.riskMultipliers, low: Number.parseFloat(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="risk-medium">Medium Risk Multiplier</Label>
                      <Input
                        id="risk-medium"
                        type="number"
                        step="0.01"
                        value={config.riskMultipliers.medium}
                        onChange={(e) => setConfig({
                          ...config,
                          riskMultipliers: { ...config.riskMultipliers, medium: Number.parseFloat(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="risk-high">High Risk Multiplier</Label>
                    <Input
                      id="risk-high"
                      type="number"
                      step="0.01"
                      value={config.riskMultipliers.high}
                      onChange={(e) => setConfig({
                        ...config,
                        riskMultipliers: { ...config.riskMultipliers, high: Number.parseFloat(e.target.value) }
                      })}
                    />
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
                <CardTitle>Integrated Standards Management</CardTitle>
                <CardDescription>
                  Manage the list of standards that can be integrated and their man-day reduction percentages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {config.integratedStandards.map((standard, index) => (
                    <div key={standard.id} className="flex items-center gap-4 p-2 border rounded-md">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`standard-id-${index}`}>Standard ID</Label>
                          <Input
                            id={`standard-id-${index}`}
                            value={standard.id}
                            onChange={(e) => updateIntegratedStandard(index, "id", e.target.value)}
                            placeholder="e.g., ISO_14001"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`standard-name-${index}`}>Standard Name</Label>
                          <Input
                            id={`standard-name-${index}`}
                            value={standard.name}
                            onChange={(e) => updateIntegratedStandard(index, "name", e.target.value)}
                            placeholder="e.g., ISO 14001"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`standard-reduction-${index}`}>Reduction (0.1 = 10%)</Label>
                          <Input
                            id={`standard-reduction-${index}`}
                            type="number"
                            step="0.01"
                            value={standard.reduction}
                            onChange={(e) =>
                              updateIntegratedStandard(index, "reduction", Number.parseFloat(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => removeIntegratedStandard(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={addIntegratedStandard} className="mt-4">
                  Add Standard
                </Button>
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
