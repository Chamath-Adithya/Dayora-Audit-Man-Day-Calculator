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
    complexityAdjustment: number
    totalBeforeIntegration: number
  }
}

export async function calculateAuditManDays(data: CalculationData): Promise<CalculationResult> {
  const config = await getConfig();

  // Get base man-days from the correct table
  const baseManDays = config.baseManDays[data.standard]?.[data.category] || 0

  if (baseManDays === 0) {
    throw new Error(`Invalid standard/category combination: ${data.standard}/${data.category}`)
  }

  // Calculate employee adjustment with improved logic
  const employeeRange = config.employeeRanges.find(
    (range) => data.employees >= range.min && data.employees <= range.max,
  )
  const employeeAdjustment = employeeRange?.adjustment || 0

  // Calculate HACCP adjustment (only for FSMS) - Fixed to avoid double-counting
  const haccpAdjustment = data.standard === "FSMS" ? (data.haccpStudies - 1) * config.haccpMultiplier : 0

  // Calculate risk adjustment with enhanced logic
  const riskLevel = config.riskLevels.find(risk => risk.id === data.riskLevel)
  const riskMultiplier = riskLevel?.multiplier || 1.0
  const riskAdjustment = baseManDays * (riskMultiplier - 1)

  // Enhanced multi-site adjustment
  let multiSiteAdjustment = 0
  if (data.sites > 1) {
    // Central function gets full base + employee adjustment
    const centralFunctionTime = baseManDays + employeeAdjustment
    // Each additional site gets 50% of base time
    const additionalSitesTime = (data.sites - 1) * (baseManDays * 0.5)
    multiSiteAdjustment = centralFunctionTime + additionalSitesTime - baseManDays
  }

  // Calculate integrated system reduction with minimum threshold
  const integratedSystemReduction = data.integratedStandards.reduce((total, currentStandardName) => {
    const standardDetails = config.integratedStandards.find(s => s.name === currentStandardName);
    return total + (standardDetails ? standardDetails.reduction : 0);
  }, 0);

  // Ensure minimum reduction of 5% when multiple standards are selected
  const effectiveReduction = data.integratedStandards.length > 1
    ? Math.max(integratedSystemReduction, 0.05)
    : integratedSystemReduction

  const integratedSystemAdjustment = -(baseManDays * effectiveReduction)

  // Calculate total before integration with all adjustments
  const totalBeforeIntegration =
    baseManDays + employeeAdjustment + haccpAdjustment + riskAdjustment + multiSiteAdjustment

  // Apply integrated system reduction
  const totalManDays = Math.max(1, totalBeforeIntegration + integratedSystemAdjustment)

  // Enhanced stage distribution for initial audits
  let stageDistribution: { stage1: number; stage2: number } | undefined
  if (data.auditType === "initial") {
    // Stage 1: 30% of total man-days (minimum 1 day, maximum 3 days)
    const stage1ManDays = Math.max(1, Math.min(3, Math.ceil(totalManDays * 0.3)))
    const stage2ManDays = Math.ceil(totalManDays * 0.7)

    stageDistribution = {
      stage1: stage1ManDays,
      stage2: stage2ManDays,
    }
  }

  // Enhanced surveillance and recertification calculations
  const surveillanceManDays = Math.ceil(totalManDays * 0.33) // 33% of initial audit
  const recertificationManDays = Math.ceil(totalManDays * 0.67) // 67% of initial audit

  // Calculate complexity factor (additional 10% for high complexity categories)
  const complexityCategories = ['I', 'J', 'K']
  const complexityAdjustment = complexityCategories.includes(data.category) ? totalManDays * 0.1 : 0

  const finalTotalManDays = Math.ceil(totalManDays + complexityAdjustment)

  return {
    totalManDays: finalTotalManDays,
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
      integratedSystemReduction: effectiveReduction,
      complexityAdjustment,
      totalBeforeIntegration,
    },
  }
}

// Helper function to get available standards and categories
export async function getAvailableStandards() {
    const config = await getConfig();
  // Return predefined standards from config instead of deriving from baseManDays
  return config.standards || []
}

export async function getAvailableCategories(standard: string) {
    const config = await getConfig();
  // Return predefined categories from config instead of deriving from baseManDays
  return config.categories || []
}

export function getAvailableAuditTypes() {
  return [
    { value: "initial", label: "Initial Certification" },
    { value: "surveillance", label: "Surveillance Audit" },
    { value: "recertification", label: "Recertification Audit" },
  ]
}

export async function getAvailableRiskLevels() {
  const config = await getConfig();
  return config.riskLevels.map(risk => ({
    value: risk.id,
    label: risk.name
  }));
}

export async function getAvailableIntegratedStandards() {
    const config = await getConfig();
  // Return the names of the configured integrated standards
  return config.integratedStandards.map(standard => standard.name);
}

// Validation function
export async function validateCalculationInput(data: Partial<CalculationData>): Promise<string[]> {
  const config = await getConfig();
  const errors: string[] = []
  
  if (!data.companyName?.trim()) {
    errors.push("Please enter a company name.")
  }
  
  if (!data.scope?.trim()) {
    errors.push("Please enter the scope of the audit.")
  }
  
  if (!data.standard || !config.baseManDays[data.standard]) {
    errors.push("Please select a valid standard.")
  }
  
  if (!data.auditType || !["initial", "surveillance", "recertification"].includes(data.auditType)) {
    errors.push("Please select a valid audit type.")
  }
  
  if (!data.category || (data.standard && !config.baseManDays[data.standard]?.[data.category])) {
    errors.push("Please select a valid category for the chosen standard.")
  }
  
  if (!data.employees || data.employees < 1) {
    errors.push("Please enter a valid number of employees (at least 1).")
  }
  
  if (!data.sites || data.sites < 1) {
    errors.push("Please enter a valid number of sites (at least 1).")
  }
  
  if (data.haccpStudies === undefined || data.haccpStudies < 0) {
    errors.push("Please enter a valid number of HACCP studies (0 or more).")
  }
  
  if (!data.riskLevel || !["low", "medium", "high"].includes(data.riskLevel)) {
    errors.push("Please select a valid risk level.")
  }
  
  if (!Array.isArray(data.integratedStandards)) {
    errors.push("Integrated standards must be an array.")
  }
  
  return errors
}
