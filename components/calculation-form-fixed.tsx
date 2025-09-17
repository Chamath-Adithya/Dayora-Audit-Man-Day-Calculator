"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { 
  getAvailableStandards, 
  getAvailableCategories, 
  getAvailableAuditTypes, 
  getAvailableRiskLevels, 
  getAvailableIntegratedStandards,
  validateCalculationInput 
} from "@/lib/audit-calculator-fixed"
import { calculateAuditManDays } from "@/lib/audit-calculator-fixed"

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

  const [availableCategories, setAvailableCategories] = useState<{ value: string; label: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Live preview of results (when key fields are present)
  const preview = useMemo(() => {
    try {
      if (!formData.standard || !formData.category || !formData.auditType || !formData.riskLevel) return null
      return calculateAuditManDays(formData)
    } catch {
      return null
    }
  }, [formData])

  // Update available categories when standard changes
  useEffect(() => {
    if (formData.standard) {
      const categories = getAvailableCategories(formData.standard).map(cat => ({
        value: cat,
        label: cat
      }))
      setAvailableCategories(categories)
      
      // Reset category if it's not available for the new standard
      if (formData.category && !categories.find(cat => cat.value === formData.category)) {
        setFormData(prev => ({ ...prev, category: "" }))
      }
    } else {
      setAvailableCategories([])
      setFormData(prev => ({ ...prev, category: "" }))
    }
  }, [formData.standard, formData.category])

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

    try {
      // Validate input
      const validationErrors = validateCalculationInput(formData)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setIsSubmitting(false)
        return
      }

      // Submit to API
      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save calculation')
      }

      // Redirect to results page
      router.push(`/results?id=${result.data.id}`)
    } catch (error) {
      console.error('Error submitting calculation:', error)
      setErrors([error instanceof Error ? error.message : 'An unexpected error occurred'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const standards = getAvailableStandards().map(standard => ({
    value: standard,
    label: standard === "QMS" ? "Quality Management System (QMS)" :
           standard === "EMS" ? "Environmental Management System (EMS)" :
           standard === "EnMS" ? "Energy Management System (EnMS)" :
           standard === "FSMS" ? "Food Safety Management System (FSMS)" :
           standard === "Cosmetics" ? "Cosmetics Good Manufacturing Practice" :
           standard
  }))

  const auditTypes = getAvailableAuditTypes()
  const riskLevels = getAvailableRiskLevels()
  const integratedStandards = getAvailableIntegratedStandards()

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    {standards.map((standard) => (
                      <SelectItem key={standard.value} value={standard.value}>
                        {standard.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['QMS','EMS','FSMS'].map(s => (
                    <Button 
                      key={s} 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleInputChange('standard', s)}
                      className="btn-animate"
                    >
                      {s}
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
                <p className="text-xs text-muted-foreground">Categories reflect complexity/sector per IAF MD 5.</p>
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
                    {riskLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Risk affects time by ±20%.</p>
              </div>
            </div>

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
                {integratedStandards.map((standard) => (
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
            <div className="flex items-center justify-between gap-3">
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
        <div>
          <div className="md:sticky md:top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Live Summary</CardTitle>
                <CardDescription>Updates as you fill the form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!preview ? (
                  <p className="text-sm text-muted-foreground">Select standard, category, audit type, and risk level to see a live preview.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Total Man-Days</span>
                      <span className="text-2xl font-semibold">{preview.totalManDays}</span>
                    </div>
                    {preview.stageDistribution && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-md bg-muted/50">
                          <div className="text-muted-foreground">Stage 1</div>
                          <div className="font-medium">{preview.stageDistribution.stage1}</div>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <div className="text-muted-foreground">Stage 2</div>
                          <div className="font-medium">{preview.stageDistribution.stage2}</div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-md bg-muted/50">
                        <div className="text-muted-foreground">Surveillance</div>
                        <div className="font-medium">{preview.surveillanceManDays}</div>
                      </div>
                      <div className="p-3 rounded-md bg-muted/50">
                        <div className="text-muted-foreground">Recertification</div>
                        <div className="font-medium">{preview.recertificationManDays}</div>
                      </div>
                    </div>
                    <div className="pt-1">
                      <div className="text-xs text-muted-foreground mb-1">Breakdown</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between"><span>Base</span><span>{preview.breakdown.baseManDays}</span></div>
                        <div className="flex justify-between"><span>Employees</span><span>{preview.breakdown.employeeAdjustment}</span></div>
                        <div className="flex justify-between"><span>HACCP</span><span>{preview.breakdown.haccpAdjustment}</span></div>
                        <div className="flex justify-between"><span>Risk</span><span>{preview.breakdown.riskAdjustment}</span></div>
                        <div className="flex justify-between"><span>Sites</span><span>{preview.breakdown.multiSiteAdjustment}</span></div>
                        <div className="flex justify-between"><span>Integrated</span><span>{preview.breakdown.integratedSystemAdjustment}</span></div>
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
