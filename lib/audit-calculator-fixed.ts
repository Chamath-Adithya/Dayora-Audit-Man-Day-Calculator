import { getConfig, AdminConfig } from "./config";

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

interface CalculationResult {
  totalManDays: number
  breakdown: {
    baseManDays: number
    employeeAdjustment: number
    haccpAdjustment: number
    riskAdjustment: number
    multiSiteAdjustment: number
    integratedSystemAdjustment: number
  }
  stageDistribution?: {
    stage1: number
    stage2: number
  }
  surveillanceManDays?: number
  recertificationManDays?: number
  details: {
    employeeRange: string
    categoryDescription: string
    riskMultiplier: number
    integratedSystemReduction: number
  }
}

export async function calculateAuditManDays(data: CalculationData): Promise<CalculationResult> {
  const config = await getConfig();

  // Get base man-days from the correct table
  const baseManDays = config.baseManDays[data.standard]?.[data.category] || 0
  
  if (baseManDays === 0) {
    throw new Error(`Invalid standard/category combination: ${data.standard}/${data.category}`)
  }

  // Calculate employee adjustment
  const employeeRange = config.employeeRanges.find(
    (range) => data.employees >= range.min && data.employees <= range.max,
  )
  const employeeAdjustment = employeeRange?.adjustment || 0

  // Calculate HACCP adjustment (only for FSMS)
  const haccpAdjustment = data.standard === "FSMS" ? data.haccpStudies * config.haccpMultiplier : 0

  // Calculate risk adjustment
  const riskMultiplier = config.riskMultipliers[data.riskLevel as keyof typeof config.riskMultipliers] || 1.0
  const riskAdjustment = baseManDays * (riskMultiplier - 1)

  // Calculate multi-site adjustment
  const multiSiteAdjustment = data.sites > 1 ? (data.sites - 1) * config.multiSiteMultiplier : 0

  // Calculate integrated system reduction
  const integratedSystemReduction = data.integratedStandards.length * config.integratedSystemReduction
  const integratedSystemAdjustment = -(baseManDays * integratedSystemReduction)

  // Calculate total before integration
  const totalBeforeIntegration = 
    baseManDays + employeeAdjustment + haccpAdjustment + riskAdjustment + multiSiteAdjustment

  // Apply integrated system reduction
  const totalManDays = Math.max(1, totalBeforeIntegration + integratedSystemAdjustment)

  // Calculate stage distribution for initial audits (IAF MD 5:2019)
  let stageDistribution: { stage1: number; stage2: number } | undefined
  if (data.auditType === "initial") {
    // Stage 1: 30% of total man-days (minimum 1 day)
    // Stage 2: 70% of total man-days
    const stage1ManDays = Math.max(1, Math.ceil(totalManDays * 0.3))
    const stage2ManDays = Math.ceil(totalManDays * 0.7)
    
    stageDistribution = {
      stage1: stage1ManDays,
      stage2: stage2ManDays,
    }
  }

  // Calculate surveillance and recertification man-days (IAF MD 5:2019)
  const surveillanceManDays = Math.ceil(totalManDays * 0.33) // 33% of initial audit
  const recertificationManDays = Math.ceil(totalManDays * 0.67) // 67% of initial audit

  return {
    totalManDays: Math.ceil(totalManDays),
    breakdown: {
      baseManDays,
      employeeAdjustment,
      haccpAdjustment,
      riskAdjustment,
      multiSiteAdjustment,
      integratedSystemAdjustment,
    },
    stageDistribution,
    surveillanceManDays,
    recertificationManDays,
    details: {
      employeeRange: employeeRange?.description || "Unknown range",
      categoryDescription: `Category ${data.category} (${data.standard})`,
      riskMultiplier,
      integratedSystemReduction,
    },
  }
}

// Helper function to get available standards and categories
export async function getAvailableStandards() {
    const config = await getConfig();
  return Object.keys(config.baseManDays)
}

export async function getAvailableCategories(standard: string) {
    const config = await getConfig();
  return Object.keys(config.baseManDays[standard] || {})
}

export function getAvailableAuditTypes() {
  return [
    { value: "initial", label: "Initial Certification" },
    { value: "surveillance", label: "Surveillance Audit" },
    { value: "recertification", label: "Recertification Audit" },
  ]
}

export function getAvailableRiskLevels() {
  return [
    { value: "low", label: "Low Risk" },
    { value: "medium", label: "Medium Risk" },
    { value: "high", label: "High Risk" },
  ]
}

export async function getAvailableIntegratedStandards() {
    const config = await getConfig();
  return Object.keys(config.baseManDays);
}

// Validation function
export async function validateCalculationInput(data: Partial<CalculationData>): Promise<string[]> {
  const config = await getConfig();
  const errors: string[] = []
  
  if (!data.companyName?.trim()) {
    errors.push("Company name is required")
  }
  
  if (!data.scope?.trim()) {
    errors.push("Scope is required")
  }
  
  if (!data.standard || !config.baseManDays[data.standard]) {
    errors.push("Valid standard is required")
  }
  
  if (!data.auditType || !["initial", "surveillance", "recertification"].includes(data.auditType)) {
    errors.push("Valid audit type is required")
  }
  
  if (!data.category || (data.standard && !config.baseManDays[data.standard]?.[data.category])) {
    errors.push("Valid category is required")
  }
  
  if (!data.employees || data.employees < 1) {
    errors.push("Number of employees must be at least 1")
  }
  
  if (!data.sites || data.sites < 1) {
    errors.push("Number of sites must be at least 1")
  }
  
  if (data.haccpStudies === undefined || data.haccpStudies < 0) {
    errors.push("HACCP studies must be 0 or greater")
  }
  
  if (!data.riskLevel || !["low", "medium", "high"].includes(data.riskLevel)) {
    errors.push("Valid risk level is required")
  }
  
  if (!Array.isArray(data.integratedStandards)) {
    errors.push("Integrated standards must be an array")
  }
  
  return errors
}

