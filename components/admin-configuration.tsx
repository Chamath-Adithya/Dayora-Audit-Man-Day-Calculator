"use client"

import { useState, useEffect } from "react"
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

interface BaseManDays {
  [standard: string]: {
    [category: string]: number
  }
}

interface RiskMultipliers {
  low: number
  medium: number
  high: number
}

interface AdminConfig {
  employeeRanges: EmployeeRange[]
  baseManDays: BaseManDays
  riskMultipliers: RiskMultipliers
  haccpMultiplier: number
  multiSiteMultiplier: number
  integratedSystemReduction: number
}

const DEFAULT_CONFIG: AdminConfig = {
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
    QMS: { AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6, C: 7, D: 8, E: 10, F: 12, G: 15, H: 18, I: 22, J: 27, K: 32 },
    EMS: { AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6, C: 7, D: 8, E: 10, F: 12, G: 15, H: 18, I: 22, J: 27, K: 32 },
    EnMS: { AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6, C: 7, D: 8, E: 10, F: 12, G: 15, H: 18, I: 22, J: 27, K: 32 },
    FSMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
    Cosmetics: { AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6, C: 7, D: 8, E: 10, F: 12, G: 15, H: 18, I: 22, J: 27, K: 32 },
  },
  riskMultipliers: { low: 0.8, medium: 1.0, high: 1.2 },
  haccpMultiplier: 0.5,
  multiSiteMultiplier: 0.5,
  integratedSystemReduction: 0.1,
}

export function AdminConfiguration() {
  const [config, setConfig] = useState<AdminConfig | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("employee-ranges")

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/config")
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
        } else {
          throw new Error("Failed to fetch config")
        }
      } catch (error) {
        console.error("Error loading admin config:", error)
        toast.error("Failed to load configuration. Using default values.")
        setConfig(DEFAULT_CONFIG)
      } finally {
        setIsLoading(false)
      }
    }
    fetchConfig()
  }, [])

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

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset all configuration to default values? This cannot be undone.")) {
      setConfig(DEFAULT_CONFIG)
      setHasChanges(true)
      toast.info("Configuration has been reset to defaults. Click 'Save Changes' to apply.")
    }
  }

  const updateEmployeeRange = (index: number, field: keyof EmployeeRange, value: number | string) => {
    if (!config) return
    const newRanges = [...config.employeeRanges]
    newRanges[index] = { ...newRanges[index], [field]: value }
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

  const updateRiskMultiplier = (risk: keyof RiskMultipliers, value: number) => {
    if (!config) return
    setConfig({
      ...config,
      riskMultipliers: {
        ...config.riskMultipliers,
        [risk]: value,
      },
    })
    setHasChanges(true)
  }

  const updateGeneralSetting = (field: keyof AdminConfig, value: number) => {
    if (!config) return
    setConfig({ ...config, [field]: value })
    setHasChanges(true)
  }

  const categories = ["AI", "AII", "BI", "BII", "BIII", "C", "D", "E", "F", "G", "H", "I", "J", "K"]
  const standards = ["QMS", "EMS", "EnMS", "FSMS", "Cosmetics"]

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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    </div>
                  </Card>
                ))}
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
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      {standards.map((standard) => (
                        <TableHead key={standard}>{standard}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category}>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{category}</Badge>
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="low-risk">Low Risk Multiplier</Label>
                  <Input
                    id="low-risk"
                    type="number"
                    step="0.1"
                    value={config.riskMultipliers.low}
                    onChange={(e) => updateRiskMultiplier("low", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium-risk">Medium Risk Multiplier</Label>
                  <Input
                    id="medium-risk"
                    type="number"
                    step="0.1"
                    value={config.riskMultipliers.medium}
                    onChange={(e) => updateRiskMultiplier("medium", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="high-risk">High Risk Multiplier</Label>
                  <Input
                    id="high-risk"
                    type="number"
                    step="0.1"
                    value={config.riskMultipliers.high}
                    onChange={(e) => updateRiskMultiplier("high", Number.parseFloat(e.target.value))}
                  />
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
                <CardTitle>Integrated System Reduction</CardTitle>
                <CardDescription>Percentage reduction per integrated standard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="integrated-reduction">Reduction per Standard (0.1 = 10%)</Label>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
