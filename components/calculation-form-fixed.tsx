"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { 
  getAvailableStandards, 
  getAvailableCategories, 
  getAvailableAuditTypes, 
  getAvailableRiskLevels, 
  getAvailableIntegratedStandards,
  validateCalculationInput, 
  calculateAuditManDays
} from "@/lib/audit-calculator-fixed"
import { apiClient } from "@/lib/api-client"
import { useConfig } from "../components/config-provider"

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

export default function CalculationFormFixed() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState<CalculationData>({
    companyName: "",
    scope: "",
    standard: "",
    auditType: "",
    category: "",
    employees: 1,
    sites: 1,
    haccpStudies: 0,
    riskLevel: "",
    integratedStandards: [],
  })

  const [availableStandards, setAvailableStandards] = useState<{ value: string; label: string }[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{ value: string; label: string; order: number }[]>([])
  const [availableIntegratedStandards, setAvailableIntegratedStandards] = useState<string[]>([]);
  const [availableRiskLevels, setAvailableRiskLevels] = useState<{ value: string; label: string }[]>([]);
  const [employeeRanges, setEmployeeRanges] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [preview, setPreview] = useState<any>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const { config, isLoading } = useConfig();

  useEffect(() => {
    if (config) {
      const standards = Object.keys(config.baseManDays);
      const integratedStandards = config.integratedStandards
        .sort((a, b) => a.order - b.order)
        .map(s => s.name);
      const riskLevels = config.riskLevels
        .sort((a, b) => a.order - b.order)
        .map(rl => ({ value: rl.id, label: rl.name }));
      const employeeRanges = config.employeeRanges
        .sort((a, b) => a.order - b.order);

      setAvailableStandards(standards.map(s => ({ value: s, label: s })));
      setAvailableIntegratedStandards(integratedStandards);
      setAvailableRiskLevels(riskLevels);
      setEmployeeRanges(employeeRanges);
    }
  }, [config]);

  useEffect(() => {
    async function updatePreview() {
      try {
        if (!formData.standard || !formData.category || !formData.auditType || !formData.riskLevel) {
          setPreview(null);
          return;
        }
        const result = await calculateAuditManDays(formData);
        setPreview(result);
      } catch {
        setPreview(null);
      }
    }
    updatePreview();
  }, [formData]);

  // Update available categories when standard changes
  useEffect(() => {
    async function updateCategories() {
      if (formData.standard) {
        try {
          const categories = await getAvailableCategories(formData.standard);

          // Sort categories by the order from the database configuration
          const sortedCategories = categories
            .map(cat => {
              // Find the category in the config to get its order
              const categoryConfig = config?.categories?.find(c => c.name === cat);
              return {
                value: cat,
                label: cat,
                order: categoryConfig?.order || 999 // Default to high order if not found
              };
            })
            .sort((a, b) => a.order - b.order);

          setAvailableCategories(sortedCategories);

          // Reset category if it's not available for the new standard
          if (formData.category && !categories.includes(formData.category)) {
            setFormData(prev => ({ ...prev, category: "" }))
          }
        } catch (error) {
          console.error('Error loading categories:', error);
          setAvailableCategories([]);
        }
      } else {
        setAvailableCategories([])
        setFormData(prev => ({ ...prev, category: "" }))
      }
    }
    updateCategories();
  }, [formData.standard, config])

  // Handle empty configuration gracefully
  const hasStandards = availableStandards.length > 0;

  // Show loading if config is still loading or no standards available yet
  if (isLoading || !hasStandards) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-4 text-muted-foreground">
          {isLoading ? "Loading calculation form..." : "Loading configuration..."}
        </p>
      </div>
    );
  }

  // Show warning if no configuration is loaded after loading is complete
  if (!hasStandards) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 fade-in">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Configuration Required
            </CardTitle>
            <CardDescription className="text-orange-700">
              No audit standards are configured. Please contact your administrator to set up the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 mb-4">
              The audit man-day calculator requires configuration data to function properly. An administrator needs to:
            </p>
            <ul className="text-sm text-orange-700 space-y-1 mb-4">
              <li>• Configure available management system standards (QMS, EMS, FSMS, etc.)</li>
              <li>• Set up employee range adjustments</li>
              <li>• Define base man-days for each standard and category</li>
              <li>• Configure risk level multipliers</li>
            </ul>
            <Button
              onClick={() => window.open('/admin', '_blank')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Open Admin Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: keyof CalculationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors([]) // Clear errors when user makes changes
  }

  const handleIntegratedStandardChange = (standard: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      integratedStandards: checked
        ? [...prev.integratedStandards, standard]
        : prev.integratedStandards.filter(s => s !== standard)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])

    if (!session?.user?.id) {
      setErrors(["You must be signed in to save a calculation."])
      setIsSubmitting(false)
      return
    }

    try {
      // Validate input
      const validationErrors = await validateCalculationInput(formData)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setIsSubmitting(false)
        return
      }

      const calculationResult = await calculateAuditManDays(formData);

      // Submit to API
      const savedCalculation = await apiClient.saveCalculation({
        ...formData,
        result: calculationResult.totalManDays,
        breakdown: calculationResult.breakdown,
        stage1ManDays: calculationResult.stageDistribution?.stage1,
        stage2ManDays: calculationResult.stageDistribution?.stage2,
        surveillanceManDays: calculationResult.surveillanceManDays,
        recertificationManDays: calculationResult.recertificationManDays,
      })

      // Redirect to results page
      router.push(`/results?id=${savedCalculation.id}`)
    } catch (error) {
      console.error('Error submitting calculation:', error)
      setErrors([error instanceof Error ? error.message : 'An unexpected error occurred'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const auditTypes = getAvailableAuditTypes()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-4 text-muted-foreground">Loading calculation form...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:hidden">
          <div className="md:sticky md:top-6">
            <Card className="card-hover">
              <CardHeader className="slide-in-right">
                <CardTitle className="text-base">Live Summary</CardTitle>
                <CardDescription>Updates as you fill the form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 slide-in-up">
                {!preview ? (
                  <p className="text-sm text-muted-foreground">Select standard, category, audit type, and risk level to see a live preview.</p>
                ) : (
                  <div className="space-y-3 fade-in">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Total Man-Days</span>
                      <span className="text-2xl font-semibold transition-all duration-300">{preview.totalManDays}</span>
                    </div>
                    {preview.stageDistribution && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-md bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                          <div className="text-muted-foreground">Stage 1</div>
                          <div className="font-medium">{preview.stageDistribution.stage1}</div>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                          <div className="text-muted-foreground">Stage 2</div>
                          <div className="font-medium">{preview.stageDistribution.stage2}</div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-md bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                        <div className="text-muted-foreground">Surveillance</div>
                        <div className="font-medium">{preview.surveillanceManDays}</div>
                      </div>
                      <div className="p-3 rounded-md bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                        <div className="text-muted-foreground">Recertification</div>
                        <div className="font-medium">{preview.recertificationManDays}</div>
                      </div>
                    </div>
                    <div className="pt-1">
                      <div className="text-xs text-muted-foreground mb-1">Breakdown</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Base</span><span>{preview.breakdown.baseManDays}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Employees</span><span>{preview.breakdown.employeeAdjustment}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>HACCP</span><span>{preview.breakdown.haccpAdjustment}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Risk</span><span>{preview.breakdown.riskAdjustment}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Sites</span><span>{preview.breakdown.multiSiteAdjustment}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Integrated</span><span>{preview.breakdown.integratedSystemAdjustment}</span></div>
                        {preview.details?.complexityAdjustment > 0 && (
                          <div className="flex justify-between transition-colors duration-200 hover:text-primary text-orange-600"><span>Complexity</span><span>+{preview.details.complexityAdjustment}</span></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="md:col-span-2 card-hover">
          <CardHeader className="slide-in-left">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 animate-pulse" />
              Audit Man-Day Calculator
            </CardTitle>
            <CardDescription>
              Calculate audit man-days based on IAF MD 5:2019 and ISO/TS 22003:2022 standards
            </CardDescription>
          </CardHeader>
          <CardContent className="slide-in-up">
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertCircle className="h-4 w-4" />
                Please fix the following errors:
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 form-field">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="e.g., Acme Manufacturing Ltd."
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2 form-field">
                <Label htmlFor="scope">Scope *</Label>
                <Input
                  id="scope"
                  value={formData.scope}
                  onChange={(e) => handleInputChange('scope', e.target.value)}
                  placeholder="e.g., Design and manufacture of plastic components"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Standard and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 form-field">
                <Label htmlFor="standard">Standard *</Label>
                <Select
                  value={formData.standard}
                  onValueChange={(value) => handleInputChange('standard', value)}
                  required
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select standard (e.g., QMS)" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStandards.map((standard) => (
                      <SelectItem key={standard.value} value={standard.value}>
                        {standard.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 pt-2">
                  {availableStandards.slice(0, 3).map((standard) => (
                    <Button
                      key={standard.value}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleInputChange('standard', standard.value)}
                      className="btn-animate"
                    >
                      {standard.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 form-field">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={!formData.standard}
                  required
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select category (AI - K)" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Categories reflect complexity/sector per IAF MD 5.</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    Database Ordered
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Type and Risk Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 form-field">
                <Label htmlFor="auditType">Audit Type *</Label>
                <Select
                  value={formData.auditType}
                  onValueChange={(value) => handleInputChange('auditType', value)}
                  required
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select audit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {auditTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 form-field">
                <Label htmlFor="riskLevel">Risk Level *</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value) => handleInputChange('riskLevel', value)}
                  required
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRiskLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Risk affects time by ±20%.</p>
              </div>
            </div>

            {/* Employee Range Reference */}
            {employeeRanges.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-blue-800">Employee Range Reference</CardTitle>
                  <CardDescription className="text-blue-600">
                    Understanding how employee count affects audit duration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    {employeeRanges.slice(0, 6).map((range, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                        <span className="font-medium">
                          {range.min === 1 ? '1' : range.min.toLocaleString()} - {range.max === 999999 ? '∞' : range.max.toLocaleString()}
                        </span>
                        <span className="text-blue-600 font-medium">
                          +{range.adjustment}
                        </span>
                      </div>
                    ))}
                    {employeeRanges.length > 6 && (
                      <div className="flex justify-center items-center p-2 bg-white rounded border text-blue-600 font-medium">
                        +{employeeRanges.length - 6} more ranges...
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    💡 Higher employee counts result in additional audit time. The system automatically applies the correct adjustment based on your employee count.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Numerical Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 form-field">
                <Label htmlFor="employees">Number of Employees *</Label>
                <Input
                  id="employees"
                  type="number"
                  min="1"
                  value={formData.employees}
                  onChange={(e) => handleInputChange('employees', parseInt(e.target.value) || 1)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">Employee bands adjust time stepwise.</p>
              </div>

              <div className="space-y-2 form-field">
                <Label htmlFor="sites">Number of Sites *</Label>
                <Input
                  id="sites"
                  type="number"
                  min="1"
                  value={formData.sites}
                  onChange={(e) => handleInputChange('sites', parseInt(e.target.value) || 1)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">Additional sites add 0.5 days each.</p>
              </div>

              <div className={`space-y-2 form-field transition-all duration-300 ${formData.standard === 'FSMS' ? 'opacity-100' : 'opacity-50'}`}>
                <Label htmlFor="haccpStudies">HACCP Studies</Label>
                <Input
                  id="haccpStudies"
                  type="number"
                  min="0"
                  value={formData.haccpStudies}
                  onChange={(e) => handleInputChange('haccpStudies', parseInt(e.target.value) || 0)}
                  disabled={formData.standard !== 'FSMS'}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.standard === 'FSMS' 
                    ? 'Only applicable for FSMS' 
                    : 'Available only when FSMS is selected'
                  }
                </p>
              </div>
            </div>

            {/* Integrated Standards */}
            <div className="space-y-2 form-field">
              <Label>Integrated Standards</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableIntegratedStandards.map((standard) => (
                  <div key={standard} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
                    <Checkbox
                      id={`integrated-${standard}`}
                      checked={formData.integratedStandards.includes(standard)}
                      onCheckedChange={(checked) => 
                        handleIntegratedStandardChange(standard, checked as boolean)
                      }
                      className="transition-all duration-200"
                    />
                    <Label 
                      htmlFor={`integrated-${standard}`}
                      className="text-sm font-normal cursor-pointer transition-colors duration-200 hover:text-primary"
                    >
                      {standard}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit & Presets */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFormData((p) => ({ ...p, employees: 20, sites: 1 }))}
                  className="btn-animate"
                >
                  Small (20, 1 site)
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFormData((p) => ({ ...p, employees: 120, sites: 1 }))}
                  className="btn-animate"
                >
                  Medium (120, 1 site)
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFormData((p) => ({ ...p, employees: 400, sites: 3 }))}
                  className="btn-animate"
                >
                  Large (400, 3 sites)
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormData({
                      companyName: "",
                      scope: "",
                      standard: "",
                      auditType: "",
                      category: "",
                      employees: 1,
                      sites: 1,
                      haccpStudies: 0,
                      riskLevel: "",
                      integratedStandards: [],
                    })
                    setErrors([])
                  }}
                  className="btn-animate"
                >
                  Reset
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[200px] btn-animate"
                >
                  {isSubmitting ? (
                    <>
                      <Calculator className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate & Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
          </CardContent>
        </Card>

        {/* Live Summary */}
        <div className="hidden md:block">
          <div className="md:sticky md:top-6">
            <Card className="card-hover">
              <CardHeader className="slide-in-right">
                <CardTitle className="text-base">Live Summary</CardTitle>
                <CardDescription>Updates as you fill the form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 slide-in-up">
                {!preview ? (
                  <p className="text-sm text-muted-foreground">Select standard, category, audit type, and risk level to see a live preview.</p>
                ) : (
                  <div className="space-y-3 fade-in">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Total Man-Days</span>
                      <span className="text-2xl font-semibold transition-all duration-300">{preview.totalManDays}</span>
                    </div>
                    {preview.stageDistribution && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-md bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                          <div className="text-muted-foreground">Stage 1</div>
                          <div className="font-medium">{preview.stageDistribution.stage1}</div>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                          <div className="text-muted-foreground">Stage 2</div>
                          <div className="font-medium">{preview.stageDistribution.stage2}</div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-md bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                        <div className="text-muted-foreground">Surveillance</div>
                        <div className="font-medium">{preview.surveillanceManDays}</div>
                      </div>
                      <div className="p-3 rounded-md bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                        <div className="text-muted-foreground">Recertification</div>
                        <div className="font-medium">{preview.recertificationManDays}</div>
                      </div>
                    </div>
                    <div className="pt-1">
                      <div className="text-xs text-muted-foreground mb-1">Breakdown</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Base</span><span>{preview.breakdown.baseManDays}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Employees</span><span>{preview.breakdown.employeeAdjustment}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>HACCP</span><span>{preview.breakdown.haccpAdjustment}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Risk</span><span>{preview.breakdown.riskAdjustment}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Sites</span><span>{preview.breakdown.multiSiteAdjustment}</span></div>
                        <div className="flex justify-between transition-colors duration-200 hover:text-primary"><span>Integrated</span><span>{preview.breakdown.integratedSystemAdjustment}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
