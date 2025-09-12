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

// Base man-days by category and standard (simplified example values)
const BASE_MAN_DAYS: Record<string, Record<string, number>> = {
  QMS: {
    AI: 2,
    AII: 3,
    BI: 4,
    BII: 5,
    BIII: 6,
    C: 7,
    D: 8,
    E: 10,
    F: 12,
    G: 15,
    H: 18,
    I: 22,
    J: 27,
    K: 32,
  },
  EMS: {
    AI: 2,
    AII: 3,
    BI: 4,
    BII: 5,
    BIII: 6,
    C: 7,
    D: 8,
    E: 10,
    F: 12,
    G: 15,
    H: 18,
    I: 22,
    J: 27,
    K: 32,
  },
  EnMS: {
    AI: 2,
    AII: 3,
    BI: 4,
    BII: 5,
    BIII: 6,
    C: 7,
    D: 8,
    E: 10,
    F: 12,
    G: 15,
    H: 18,
    I: 22,
    J: 27,
    K: 32,
  },
  FSMS: {
    AI: 3,
    AII: 4,
    BI: 5,
    BII: 6,
    BIII: 7,
    C: 8,
    D: 10,
    E: 12,
    F: 15,
    G: 18,
    H: 22,
    I: 27,
    J: 32,
    K: 38,
  },
  Cosmetics: {
    AI: 2,
    AII: 3,
    BI: 4,
    BII: 5,
    BIII: 6,
    C: 7,
    D: 8,
    E: 10,
    F: 12,
    G: 15,
    H: 18,
    I: 22,
    J: 27,
    K: 32,
  },
}

// Employee ranges and adjustments
const EMPLOYEE_RANGES = [
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
  { min: 1176, max: Number.POSITIVE_INFINITY, adjustment: 10, description: "1176+ employees" },
]

// Risk multipliers
const RISK_MULTIPLIERS = {
  low: 0.8,
  medium: 1.0,
  high: 1.2,
}

export function calculateAuditManDays(data: CalculationData): CalculationResult {
  // Load admin configuration
  const savedConfig = localStorage.getItem("adminConfig")
  let config = {
    employeeRanges: EMPLOYEE_RANGES,
    baseManDays: BASE_MAN_DAYS,
    riskMultipliers: RISK_MULTIPLIERS,
    haccpMultiplier: 0.5,
    multiSiteMultiplier: 0.5,
    integratedSystemReduction: 0.1,
  }

  if (savedConfig) {
    try {
      const parsedConfig = JSON.parse(savedConfig)
      config = { ...config, ...parsedConfig }
    } catch (error) {
      console.error("Error loading admin config:", error)
    }
  }

  // Get base man-days using admin config
  const baseManDays = config.baseManDays[data.standard]?.[data.category] || 0

  // Calculate employee adjustment using admin config
  const employeeRange = config.employeeRanges.find(
    (range) => data.employees >= range.min && data.employees <= range.max,
  )
  const employeeAdjustment = employeeRange?.adjustment || 0

  // Calculate HACCP adjustment using admin config
  const haccpAdjustment = data.standard === "FSMS" ? data.haccpStudies * config.haccpMultiplier : 0

  // Calculate risk adjustment using admin config
  const riskMultiplier = config.riskMultipliers[data.riskLevel as keyof typeof config.riskMultipliers] || 1.0
  const riskAdjustment = baseManDays * (riskMultiplier - 1)

  // Calculate multi-site adjustment using admin config
  const multiSiteAdjustment = data.sites > 1 ? (data.sites - 1) * config.multiSiteMultiplier : 0

  // Calculate integrated system reduction using admin config
  const integratedSystemReduction = data.integratedStandards.length * config.integratedSystemReduction
  const integratedSystemAdjustment = -(baseManDays * integratedSystemReduction)

  // Calculate total
  const totalBeforeIntegration =
    baseManDays + employeeAdjustment + haccpAdjustment + riskAdjustment + multiSiteAdjustment
  const totalManDays = Math.max(1, totalBeforeIntegration + integratedSystemAdjustment)

  // Calculate stage distribution for initial audits
  let stageDistribution: { stage1: number; stage2: number } | undefined
  if (data.auditType === "initial") {
    stageDistribution = {
      stage1: Math.ceil(totalManDays * 0.3),
      stage2: Math.ceil(totalManDays * 0.7),
    }
  }

  // Calculate surveillance and recertification man-days
  const surveillanceManDays = Math.ceil(totalManDays * 0.33)
  const recertificationManDays = Math.ceil(totalManDays * 0.67)

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
      categoryDescription: `Category ${data.category}`,
      riskMultiplier,
      integratedSystemReduction,
    },
  }
}
