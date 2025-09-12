"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator } from "lucide-react"
import { useRouter } from "next/navigation"

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

const standards = [
  { value: "QMS", label: "Quality Management System (QMS)" },
  { value: "EMS", label: "Environmental Management System (EMS)" },
  { value: "EnMS", label: "Energy Management System (EnMS)" },
  { value: "FSMS", label: "Food Safety Management System (FSMS)" },
  { value: "Cosmetics", label: "Cosmetics Good Manufacturing Practice" },
]

const auditTypes = [
  { value: "initial", label: "Initial Certification" },
  { value: "surveillance", label: "Surveillance" },
  { value: "recertification", label: "Recertification" },
]

const categories = [
  { value: "AI", label: "AI" },
  { value: "AII", label: "AII" },
  { value: "BI", label: "BI" },
  { value: "BII", label: "BII" },
  { value: "BIII", label: "BIII" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  { value: "F", label: "F" },
  { value: "G", label: "G" },
  { value: "H", label: "H" },
  { value: "I", label: "I" },
  { value: "J", label: "J" },
  { value: "K", label: "K" },
]

const riskLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

const integratedStandardOptions = [
  { value: "ISO9001", label: "ISO 9001" },
  { value: "ISO14001", label: "ISO 14001" },
  { value: "ISO45001", label: "ISO 45001" },
  { value: "ISO50001", label: "ISO 50001" },
  { value: "ISO22000", label: "ISO 22000" },
  { value: "ISO27001", label: "ISO 27001" },
]

export function CalculationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<CalculationData>({
    companyName: "",
    scope: "",
    standard: "",
    auditType: "",
    category: "",
    employees: 0,
    sites: 1,
    haccpStudies: 0,
    riskLevel: "",
    integratedStandards: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required"
    }
    if (!formData.scope.trim()) {
      newErrors.scope = "Scope/Industry sector is required"
    }
    if (!formData.standard) {
      newErrors.standard = "Standard is required"
    }
    if (!formData.auditType) {
      newErrors.auditType = "Audit type is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (formData.employees <= 0) {
      newErrors.employees = "Number of employees must be greater than 0"
    }
    if (formData.sites <= 0) {
      newErrors.sites = "Number of sites must be greater than 0"
    }
    if (formData.standard === "FSMS" && formData.haccpStudies < 0) {
      newErrors.haccpStudies = "Number of HACCP studies cannot be negative"
    }
    if (!formData.riskLevel) {
      newErrors.riskLevel = "Risk/Complexity level is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Store calculation data in localStorage for now
      localStorage.setItem("calculationData", JSON.stringify(formData))
      router.push("/results")
    }
  }

  const handleIntegratedStandardChange = (standardValue: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      integratedStandards: checked
        ? [...prev.integratedStandards, standardValue]
        : prev.integratedStandards.filter((s) => s !== standardValue),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Details */}
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
          <CardDescription>Enter the basic information about the client organization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
                className={errors.companyName ? "border-destructive" : ""}
              />
              {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="scope">Scope / Industry Sector *</Label>
              <Input
                id="scope"
                value={formData.scope}
                onChange={(e) => setFormData((prev) => ({ ...prev, scope: e.target.value }))}
                placeholder="e.g., Manufacturing, Healthcare, Food Processing"
                className={errors.scope ? "border-destructive" : ""}
              />
              {errors.scope && <p className="text-sm text-destructive">{errors.scope}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Details */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Details</CardTitle>
          <CardDescription>Specify the audit parameters and management system standard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="standard">Standard *</Label>
              <Select
                value={formData.standard}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, standard: value }))}
              >
                <SelectTrigger className={errors.standard ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select standard" />
                </SelectTrigger>
                <SelectContent>
                  {standards.map((standard) => (
                    <SelectItem key={standard.value} value={standard.value}>
                      {standard.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.standard && <p className="text-sm text-destructive">{errors.standard}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditType">Audit Type *</Label>
              <Select
                value={formData.auditType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, auditType: value }))}
              >
                <SelectTrigger className={errors.auditType ? "border-destructive" : ""}>
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
              {errors.auditType && <p className="text-sm text-destructive">{errors.auditType}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Enter organizational parameters that affect audit duration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employees">Number of Employees *</Label>
              <Input
                id="employees"
                type="number"
                min="1"
                value={formData.employees || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, employees: Number.parseInt(e.target.value) || 0 }))}
                placeholder="Enter number of employees"
                className={errors.employees ? "border-destructive" : ""}
              />
              {errors.employees && <p className="text-sm text-destructive">{errors.employees}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sites">Number of Sites *</Label>
              <Input
                id="sites"
                type="number"
                min="1"
                value={formData.sites || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, sites: Number.parseInt(e.target.value) || 1 }))}
                placeholder="Enter number of sites"
                className={errors.sites ? "border-destructive" : ""}
              />
              {errors.sites && <p className="text-sm text-destructive">{errors.sites}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk/Complexity Level *</Label>
              <Select
                value={formData.riskLevel}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, riskLevel: value }))}
              >
                <SelectTrigger className={errors.riskLevel ? "border-destructive" : ""}>
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
              {errors.riskLevel && <p className="text-sm text-destructive">{errors.riskLevel}</p>}
            </div>
          </div>

          {/* HACCP Studies - Only show for FSMS */}
          {formData.standard === "FSMS" && (
            <div className="space-y-2">
              <Label htmlFor="haccpStudies">Number of HACCP Studies</Label>
              <Input
                id="haccpStudies"
                type="number"
                min="0"
                value={formData.haccpStudies || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, haccpStudies: Number.parseInt(e.target.value) || 0 }))
                }
                placeholder="Enter number of HACCP studies"
                className={`md:w-1/3 ${errors.haccpStudies ? "border-destructive" : ""}`}
              />
              {errors.haccpStudies && <p className="text-sm text-destructive">{errors.haccpStudies}</p>}
            </div>
          )}

          {/* Integrated Standards */}
          <div className="space-y-3">
            <Label>Integrated Standards (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {integratedStandardOptions.map((standard) => (
                <div key={standard.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={standard.value}
                    checked={formData.integratedStandards.includes(standard.value)}
                    onCheckedChange={(checked) => handleIntegratedStandardChange(standard.value, checked as boolean)}
                  />
                  <Label htmlFor={standard.value} className="text-sm font-normal">
                    {standard.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button type="submit" size="lg" className="px-8">
          <Calculator className="mr-2 h-5 w-5" />
          Calculate Audit Man-Days
        </Button>
      </div>
    </form>
  )
}
