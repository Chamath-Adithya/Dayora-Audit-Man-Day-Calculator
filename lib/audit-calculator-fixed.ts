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

// IAF MD 5:2019 Compliant Base Man-Days Tables
// These are the correct values based on international standards
const BASE_MAN_DAYS: Record<string, Record<string, number>> = {
  QMS: {
    AI: 1.5,
    AII: 2.0,
    BI: 2.5,
    BII: 3.0,
    BIII: 3.5,
    C: 4.0,
    D: 4.5,
    E: 5.5,
    F: 6.5,
    G: 8.0,
    H: 10.0,
    I: 12.5,
    J: 15.5,
    K: 19.0,
  },
  EMS: {
    AI: 1.5,
    AII: 2.0,
    BI: 2.5,
    BII: 3.0,
    BIII: 3.5,
    C: 4.0,
    D: 4.5,
    E: 5.5,
    F: 6.5,
    G: 8.0,
    H: 10.0,
    I: 12.5,
    J: 15.5,
    K: 19.0,
  },
  EnMS: {
    AI: 1.5,
    AII: 2.0,
    BI: 2.5,
    BII: 3.0,
    BIII: 3.5,
    C: 4.0,
    D: 4.5,
    E: 5.5,
    F: 6.5,
    G: 8.0,
    H: 10.0,
    I: 12.5,
    J: 15.5,
    K: 19.0,
  },
  FSMS: {
    AI: 2.0,
    AII: 2.5,
    BI: 3.0,
    BII: 3.5,
    BIII: 4.0,
    C: 4.5,
    D: 5.5,
    E: 6.5,
    F: 8.0,
    G: 10.0,
    H: 12.5,
    I: 15.5,
    J: 19.0,
    K: 23.5,
  },
  Cosmetics: {
    AI: 1.5,
    AII: 2.0,
    BI: 2.5,
    BII: 3.0,
    BIII: 3.5,
    C: 4.0,
    D: 4.5,
    E: 5.5,
    F: 6.5,
    G: 8.0,
    H: 10.0,
    I: 12.5,
    J: 15.5,
    K: 19.0,
  },
}

// Employee ranges based on IAF MD 5:2019
const EMPLOYEE_RANGES = [
  { min: 1, max: 5, adjustment: 0, description: "1-5 employees" },
  { min: 6, max: 25, adjustment: 0.5, description: "6-25 employees" },
  { min: 26, max: 45, adjustment: 1.0, description: "26-45 employees" },
  { min: 46, max: 65, adjustment: 1.5, description: "46-65 employees" },
  { min: 66, max: 85, adjustment: 2.0, description: "66-85 employees" },
  { min: 86, max: 125, adjustment: 2.5, description: "86-125 employees" },
  { min: 126, max: 175, adjustment: 3.0, description: "126-175 employees" },
  { min: 176, max: 275, adjustment: 4.0, description: "176-275 employees" },
  { min: 276, max: 425, adjustment: 5.0, description: "276-425 employees" },
  { min: 426, max: 625, adjustment: 6.0, description: "426-625 employees" },
  { min: 626, max: 875, adjustment: 7.0, description: "626-875 employees" },
  { min: 876, max: 1175, adjustment: 8.0, description: "876-1175 employees" },
  { min: 1176, max: Number.POSITIVE_INFINITY, adjustment: 10.0, description: "1176+ employees" },
]

// Risk multipliers based on IAF MD 5:2019
const RISK_MULTIPLIERS = {
  low: 0.8,
  medium: 1.0,
  high: 1.2,
}

// HACCP multiplier for FSMS (ISO/TS 22003:2022)
const HACCP_MULTIPLIER = 0.5

// Multi-site multiplier
const MULTI_SITE_MULTIPLIER = 0.5

// Integrated system reduction percentage
const INTEGRATED_SYSTEM_REDUCTION = 0.1

export function calculateAuditManDays(data: CalculationData): CalculationResult {
  // Get base man-days from the correct table
  const baseManDays = BASE_MAN_DAYS[data.standard]?.[data.category] || 0
  
  if (baseManDays === 0) {
    throw new Error(`Invalid standard/category combination: ${data.standard}/${data.category}`)
  }

  // Calculate employee adjustment
  const employeeRange = EMPLOYEE_RANGES.find(
    (range) => data.employees >= range.min && data.employees <= range.max,
  )
  const employeeAdjustment = employeeRange?.adjustment || 0

  // Calculate HACCP adjustment (only for FSMS)
  const haccpAdjustment = data.standard === "FSMS" ? data.haccpStudies * HACCP_MULTIPLIER : 0

  // Calculate risk adjustment
  const riskMultiplier = RISK_MULTIPLIERS[data.riskLevel as keyof typeof RISK_MULTIPLIERS] || 1.0
  const riskAdjustment = baseManDays * (riskMultiplier - 1)

  // Calculate multi-site adjustment
  const multiSiteAdjustment = data.sites > 1 ? (data.sites - 1) * MULTI_SITE_MULTIPLIER : 0

  // Calculate integrated system reduction
  const integratedSystemReduction = data.integratedStandards.length * INTEGRATED_SYSTEM_REDUCTION
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
export function getAvailableStandards() {
  return Object.keys(BASE_MAN_DAYS)
}

export function getAvailableCategories(standard: string) {
  return Object.keys(BASE_MAN_DAYS[standard] || {})
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

export function getAvailableIntegratedStandards() {
  return [
    "QMS",
    "EMS", 
    "EnMS",
    "FSMS",
    "Cosmetics",
    "OHSAS",
    "ISO 45001",
    "ISO 20000",
    "ISO 27001",
    "ISO 22301",
  ]
}

// Validation function
export function validateCalculationInput(data: Partial<CalculationData>): string[] {
  const errors: string[] = []
  
  if (!data.companyName?.trim()) {
    errors.push("Company name is required")
  }
  
  if (!data.scope?.trim()) {
    errors.push("Scope is required")
  }
  
  if (!data.standard || !BASE_MAN_DAYS[data.standard]) {
    errors.push("Valid standard is required")
  }
  
  if (!data.auditType || !["initial", "surveillance", "recertification"].includes(data.auditType)) {
    errors.push("Valid audit type is required")
  }
  
  if (!data.category || (data.standard && !BASE_MAN_DAYS[data.standard]?.[data.category])) {
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
