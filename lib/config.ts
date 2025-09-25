
interface EmployeeRange {
  min: number;
  max: number;
  adjustment: number;
  description: string;
}

interface BaseManDays {
  [standard: string]: {
    [category: string]: number;
  };
}

interface RiskMultipliers {
  low: number;
  medium: number;
  high: number;
}

export interface AdminConfig {
  employeeRanges: { min: number; max: number; adjustment: number, description: string }[]
  baseManDays: { [standard: string]: { [category: string]: number } }
  riskMultipliers: { low: number; medium: number; high: number }
  haccpMultiplier: number
  multiSiteMultiplier: number
  integratedSystemReduction: number
  integratedStandards: { id: string; name: string; reduction: number }[]
}

let configCache: AdminConfig | null = null;

export async function getConfig(): Promise<AdminConfig> {
  if (configCache) {
    return configCache;
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || '';
    const response = await fetch(`${baseUrl}/api/config`);
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    const config = await response.json();
    configCache = config;
    return config;
  } catch (error) {
    console.error("Error fetching config from database:", error);

    // Return empty configuration - everything must come from database
    return {
      employeeRanges: [],
      baseManDays: {},
      riskMultipliers: { low: 1.0, medium: 1.0, high: 1.0 },
      haccpMultiplier: 0,
      multiSiteMultiplier: 0,
      integratedSystemReduction: 0,
      integratedStandards: [],
    };
  }
}
